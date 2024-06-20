import {Router} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.model';
import { DemoUserModel } from '../models/user.model';
import { PurchaseOrderModel } from '../models/purchase.model';
import { PortofolioModel } from '../models/purchase.model';
import { StockModel } from '../models/stocks.model';
import { CryptoModel } from '../models/crypto.model';
import { MarketStatusModel } from '../models/marketStatus';
import cron from "node-cron";
const router = Router();

router.get('/user/purchase-orders/:userId', expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    try {
        const purchaseOder = await PurchaseOrderModel.find({ userId: userId });
        res.status(200).send(purchaseOder);
    } catch (error:any) {
        res.status(500).send({ message: 'Error retrieving transactions for user', error: error.message });
    }
}));

router.get('/user/portofolio/:userId', expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    try {
        const portofolioModel = await PortofolioModel.find({ userId: userId });
        res.status(200).send(portofolioModel);
    } catch (error:any) {
        res.status(500).send({ message: 'Error retrieving transactions for user', error: error.message });
    }
}));
router.get('/user/portfolio/stats/:userId', expressAsyncHandler(async (req, res) => {
    const {userId} = req.params;
    try {
        const portfolioItems = await PortofolioModel.find({ userId: userId });
        const stats = {
            stocks: portfolioItems.filter(item => item.type === 'stock').length,
            cryptos: portfolioItems.filter(item => item.type === 'crypto').length
        };
        res.status(200).send(stats);
    } catch (error:any) {
        res.status(500).send({ message: 'Error retrieving portfolio items', error: error.message });
    }
}));

router.post('/purchase-orders', async (req, res) => {
    const { userId, symbol, price, id, nrOfActions, amount, type } = req.body;

    let user = await UserModel.findOne({ _id: userId });
    let isDemo = false;
    if (!user) {
        user = await DemoUserModel.findOne({ _id: userId });
        isDemo = true;
    }

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    if (!userId || !symbol || isNaN(price) || !id || isNaN(nrOfActions) || nrOfActions <= 0 || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        // Scădem soldul utilizatorului imediat
        user.balance -= amount;
        await user.save();

        // Creăm comanda de cumpărare cu statusul pending
        const purchaseOrder = new PurchaseOrderModel({
            userId,
            symbol,
            price,
            id,
            nrOfActions,
            amount,
            transactionType: 'buy',
            status: 'pending'
        });
        await purchaseOrder.save();

        res.status(201).json({
            message: 'Purchase order created successfully',
            purchaseOrder
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
router.post('/portfolio/sell', async (req, res) => {
    const { nrOfAction, symbol, price, userId, type } = req.body;
    const amount = nrOfAction * price;

    let user = await UserModel.findOne({ _id: userId });
    let isDemo = false;
    if (!user) {
        user = await DemoUserModel.findOne({ _id: userId });
        isDemo = true;
    }

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const portfolioEntry = await PortofolioModel.findOne({ userId: userId, symbol: symbol });
    if (!portfolioEntry) {
        return res.status(404).send('Portfolio entry not found');
    }

    if (portfolioEntry.nrOfAction < nrOfAction) {
        return res.status(400).send('Not enough shares to sell');
    }

    const stock = await StockModel.findOne({ symbol: symbol });
    let id = stock?._id;
    if (!id) {
        const crypto = await CryptoModel.findOne({ symbol: symbol });
        id = crypto?._id;
    }

    try {
        // Creăm comanda de vânzare cu statusul pending
        const sellOrder = new PurchaseOrderModel({
            userId,
            symbol,
            price,
            id,
            nrOfActions: nrOfAction,
            amount,
            transactionType: 'sell',
            status: 'pending'
        });
        await sellOrder.save();

        res.status(201).json({
            message: 'Sell order created successfully',
            sellOrder
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export const processPendingOrders = async () => {
    try {
        const pendingOrders = await PurchaseOrderModel.find({ status: 'pending' });

        for (const order of pendingOrders) {
            const user = await UserModel.findOne({ _id: order.userId }) || await DemoUserModel.findOne({ _id: order.userId });

            if (!user) {
                console.error(`User not found for order ${order._id}`);
                continue;
            }

            let asset = await StockModel.findOne({ symbol: order.symbol });
            let type = 'stock';

            if (!asset) {
                asset = await CryptoModel.findOne({ symbol: order.symbol });
                type = 'crypto';
            }

            if (!asset) {
                console.error(`Asset not found for order ${order._id}`);
                continue;
            }

            if (type === 'stock') {
                const marketStatus = await MarketStatusModel.findOne({
                    primary_exchanges: { $regex: new RegExp(`\\b${asset.exchangeShortName}\\b`, 'i') }
                });

                if (!marketStatus || marketStatus.current_status === 'closed') {
                    continue;
                }
            }

            // Update order status to 'executed'
            order.status = 'executed';
            await order.save();

            if (order.transactionType === 'buy') {
                // Update or create portfolio entry for buy orders
                const existingPortfolio = await PortofolioModel.findOne({ userId: order.userId, symbol: order.symbol });
                if (existingPortfolio) {
                    existingPortfolio.nrOfAction += order.nrOfActions;
                    existingPortfolio.investedAmount += order.amount;
                    await existingPortfolio.save();
                } else {
                    const newPortfolio = new PortofolioModel({
                        userId: order.userId,
                        symbol: order.symbol,
                        symbolId: order.id,
                        nrOfAction: order.nrOfActions,
                        investedAmount: order.amount,
                        type: type
                    });
                    await newPortfolio.save();
                }
            } else if (order.transactionType === 'sell') {
                // Update portfolio entry and user balance for sell orders
                const portfolioEntry = await PortofolioModel.findOne({ userId: order.userId, symbol: order.symbol });
                if (portfolioEntry) {
                    portfolioEntry.nrOfAction -= order.nrOfActions;
                    portfolioEntry.investedAmount -= order.amount;
                    if (portfolioEntry.nrOfAction === 0) {
                        await portfolioEntry.deleteOne();
                    } else {
                        await portfolioEntry.save();
                    }
                }

                user.balance += order.amount;
                await user.save();
            }

            console.log(`Processed pending order ${order._id}`);
        }
    } catch (error) {
        console.error('Error processing pending orders:', error);
    }
};

cron.schedule('* * * * *', async () => {
    console.log('Running pending orders processing job...');
    await processPendingOrders();
});
  export default router;
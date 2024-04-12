import {Router} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PurchaseOrder } from '../models/purchase.model';
import { Portofolio } from '../models/purchase.model';
import { User, UserModel } from '../models/user.model';
import { PurchaseOrderModel } from '../models/purchase.model';
import { PortofolioModel } from '../models/purchase.model';
import { TransactionsModel } from '../models/transaction.model';
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

router.post('/purchase-orders', async (req, res) => {
    const { userId, stockSymbol, stockPrice, stockId, nrOfActions, amount } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Validarea datelor
    if (!userId || !stockSymbol || isNaN(stockPrice) || !stockId || isNaN(nrOfActions) || nrOfActions <= 0 || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        // Actualizează sau creează în portofoliu
        const existingPortfolio = await PortofolioModel.findOne({ userId: userId, stockSymbol: stockSymbol });
        if (existingPortfolio) {
            existingPortfolio.nrOfActions += nrOfActions;
            existingPortfolio.investedAmount += amount;
            await existingPortfolio.save();
        } else {
            const newPortfolio = new PortofolioModel({
                userId,
                stockSymbol,
                nrOfActions,
                investedAmount: amount,
                type: 'stock' // sau 'crypto', depinde de logica ta specifică
            });
            await newPortfolio.save();
        }

        // Deduce suma din balanța utilizatorului și salvează comanda
        user.balance -= amount;
        await user.save();

        const purchaseOrder = new PurchaseOrderModel({
            userId,
            stockSymbol,
            stockPrice,
            stockId,
            nrOfActions,
            amount,
            transactionType: 'buy',
            status: 'pending'
        });
        await purchaseOrder.save();

        res.status(201).json({
            message: 'Purchase order and portfolio updated successfully',
            purchaseOrder
        });
    } catch (error:any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


  export default router;
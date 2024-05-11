import {Router} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PurchaseOrder } from '../models/purchase.model';
import { Portofolio } from '../models/purchase.model';
import { User, UserModel } from '../models/user.model';
import { PurchaseOrderModel } from '../models/purchase.model';
import { PortofolioModel } from '../models/purchase.model';
import { TransactionsModel } from '../models/transaction.model';
import { StockModel } from '../models/stocks.model';
import { Stock } from '../models/stocks.model';
import { CryptoModel } from '../models/crypto.model';
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
    const { userId, symbol, price, id, nrOfActions, amount,type } = req.body;
    const user = await UserModel.findById(userId);
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
        const existingPortfolio = await PortofolioModel.findOne({ userId: userId, symbol: symbol });
        if (existingPortfolio) {
            existingPortfolio.nrOfActions += nrOfActions;
            existingPortfolio.investedAmount += amount;
            await existingPortfolio.save();
        } else {
            const newPortfolio = new PortofolioModel({
                userId,
                symbol,
                symbolId: id,
                nrOfActions,
                investedAmount: amount,
                type: type // sau 'crypto', depinde de logica ta specifică
            });
            await newPortfolio.save();
        }

        // Deduce suma din balanța utilizatorului și salvează comanda
        user.balance -= amount;
        await user.save();

        const purchaseOrder = new PurchaseOrderModel({
            userId,
            symbol,
            price,
            id,
            nrOfActions,
            amount,
            transactionType: 'buy',
            status: 'executed'
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
router.post('/portfolio/sell', async (req, res) => {
    console.log(req.body);
    const { nrOfAction, symbol,price, userId } = req.body;
    const amount=nrOfAction * price;
    try {
        const portfolioEntry = await PortofolioModel.findOne({ userId: userId, symbol: symbol });
      if (!portfolioEntry) {
        return res.status(404).send('Portfolio entry not found');
      }
  
      // Actualizează numărul de acțiuni
      if (portfolioEntry.nrOfActions< nrOfAction) {
        return res.status(400).send('Not enough shares to sell');
      }
      portfolioEntry.investedAmount+=amount;
      portfolioEntry.nrOfActions -= nrOfAction;
      portfolioEntry.investedAmount-=amount;
      if (portfolioEntry.nrOfActions === 0) {
        await portfolioEntry.deleteOne(); // Elimină intrarea dacă nu mai sunt acțiuni
      } else {
        await portfolioEntry.save(); // Altfel, actualizează intrarea existentă
      }
  
      // Actualizează soldul utilizatorului
      const user = await UserModel.findById(userId);
      const stock = await StockModel.findOne({symbol:symbol});
      var id = stock?._id;
      if(!id){
        const crypto = await CryptoModel.findOne({symbol:symbol});
        id=crypto?._id;
      }
      if (user) {
        user.balance += nrOfAction * price;
        await user.save();
      }
      const purchaseOrder = new PurchaseOrderModel({
        userId,
        symbol,
        price,
        id,
        nrOfActions:nrOfAction,
        amount,
        transactionType: 'sell',
        status: 'executed'
    });
    await purchaseOrder.save();
      
  
      res.send(JSON.stringify({ message: "Stock sold successfully" }));
    } catch (error) {
      console.error('Failed to sell stock', error);
      res.status(500).send('Internal Server Error');
    }
  });
  export default router;
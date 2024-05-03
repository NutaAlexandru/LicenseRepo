import {Router} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { TransactionsModel } from '../models/transaction.model';
import { User, UserModel } from '../models/user.model';
import jwt from "jsonwebtoken";
const router = Router();

router.get('/user/:userId', expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;

    try {
        const transactions = await TransactionsModel.find({ user: userId });
        res.status(200).send(transactions);
    } catch (error:any) {
        res.status(500).send({ message: 'Error retrieving transactions for user', error: error.message });
    }
}));

router.post('/create', expressAsyncHandler(async (req, res) => {
    const transactionData = req.body;
    const userExists = await UserModel.findById(transactionData.user);
    if (!userExists) {
        res.status(404).send({ message: 'User not found' });
        return;
    }
    if(transactionData.type==='withdrawal' && userExists.balance<transactionData.amount){
        res.status(400).send({ message: 'Insufficient funds' });
        return;
    }
    else if(transactionData.type==='withdrawal' && transactionData.amount<0){
        res.status(400).send({ message: 'Invalid amount' });
        return;
    }
    else if(transactionData.type==='deposit' && transactionData.amount<0){
        res.status(400).send({ message: 'Invalid amount' });
        return;
    }
    else if(!transactionData.transactionId){
        const { v4: uuidv4 } = require('uuid');
        const id = uuidv4();
        transactionData.transactionId = id;
    }
    const newTransaction = new TransactionsModel({
        id:'',
        user: transactionData.user,
        transactionId:transactionData.transactionId,
        amount: transactionData.amount,
        type: transactionData.type,
 
    });

    try {
        const savedTransaction = await newTransaction.save();
        res.status(201).send({
            message: 'Transaction created successfully',
            transaction: savedTransaction
        });
    } catch (error) {
        console.error('Error saving the transaction:', error);
        res.status(500).send({ message: 'Error creating the transaction' });
    }
}));

router.put('/update-balance', expressAsyncHandler(async (req, res) => {
    const  transaction = req.body;
    const tempuser=await UserModel.findById(transaction.user);
    if (!tempuser) {
        res.status(404).send({ message: 'User not found' });
        return;
    }
    if (transaction.type === 'deposit') {
        tempuser.balance +=transaction.amount;
    }  else if (transaction.type === 'withdrawal'){
        tempuser.balance -= transaction.amount;}
    else {
        res.status(400).send({ message: 'Invalid transaction type' });
        return;
    }
    try {
        const updatedUser = await tempuser.save();
        res.send({
            message: 'User balance updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                balance: updatedUser.balance
            }
        });
    } catch (error) {
        console.error('Error updating the user balance:', error);
        res.status(500).send({ message: 'Error updating the user balance' });
    }
    
}));

const generateToken=(user:User)=>{
    const token=jwt.sign({
        id: user.id,email:user.email
    },'secret',{
        expiresIn:"200d"
    });
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        balance:user.balance,
        token: token
      };
}
  
  export default router;
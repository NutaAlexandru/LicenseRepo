import mongoose, { Document, ObjectId } from 'mongoose';
import { Schema, model} from 'mongoose';

export interface PurchaseOrder{
    userId: ObjectId | string;
    date: Date;
    stockSymbol:string;
    stockPrice:number;
    stockId:ObjectId | string;
    nrOfAction:number;
    amount:number;
    status:'executed'| 'pending' | 'cancelled';
    transactionType: 'buy' | 'sell';
}

const purchaseOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock',required: true },
    nrOfActions: { type: Number, required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['buy', 'sell']},
    status: { type: String, enum: ['executed', 'pending', 'cancelled'], default: 'pending' },
  },
  {
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
});

export interface Portofolio{
    userId:ObjectId | string;
    stockSymbol:string;
    type:'stock' | 'crypto';
    nrOfActions:number;
    investedAmount:number;
};

const portfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    symbolId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, required: true, enum: ['stock', 'crypto'] },
    nrOfActions: { type: Number, required: true },
    investedAmount: { type: Number, required: true }
  },
  {
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
});

  export const PurchaseOrderModel=model<PurchaseOrder>('PurchaseOrder',purchaseOrderSchema);
  export const PortofolioModel=model<Portofolio>('Portofolio',portfolioSchema);
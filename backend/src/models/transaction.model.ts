import mongoose, { Document, ObjectId } from 'mongoose';
import { Schema, model} from 'mongoose';


export interface Transactions{
    id:string;
    transactionId:string;
    user: ObjectId | string;
    amount: number;
    type: 'deposit' | 'withdrawal';
    date: Date;
}

const transactionSchema = new Schema<Transactions>({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    transactionId:{
        type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    }
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
  export const TransactionsModel=model<Transactions>('Transaction',transactionSchema);
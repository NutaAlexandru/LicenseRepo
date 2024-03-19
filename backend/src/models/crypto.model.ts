import { Schema, model} from 'mongoose';

export interface Crypto{
    symbol:string;
    name:string;
    currency:string;
    stockExchange:string;
    exchangeShortNumber:string;
}

export const CyptoSchema=new Schema<Crypto>({
    symbol:{type:String,required:true},
    name:{type:String,required:true},
    currency:{type:String,required:true},
    stockExchange:{type:String,required:true},
    exchangeShortNumber:{type:String,required:false}
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

export const CryptoModel=model<Crypto>('Crypto',CyptoSchema);
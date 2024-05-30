import { Schema, model} from 'mongoose';

export interface Stock{
    
        symbol:string;
        name:string;
        price:number;
        exchange:string;
        exchangeShortName:string;
        type:string;
        favorite:boolean;
}

export const StockSchema=new Schema<Stock>({
    symbol:{type:String,required:true},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    exchange:{type:String,required:false},
    exchangeShortName:{type:String,required:false},
    type:{type:String,required:false},
    favorite: { type: Boolean, default: false }
},
{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
}
);

export const StockModel=model<Stock>('Stock',StockSchema);
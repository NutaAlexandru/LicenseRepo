import { Schema, model} from 'mongoose';

export interface Stock{
    
        id:string;
        name:string;
        price:number;
        stock:number;
        date:string;
}

export const StockSchema=new Schema<Stock>({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    stock:{type:Number,required:true},
    date:{type:String,required:true},
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
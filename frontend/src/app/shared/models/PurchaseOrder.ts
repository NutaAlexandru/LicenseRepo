export class PurchaseOrder{
    userId: string;
    date: Date;
    symbol:string;
    price:number;
    id:string;
    nrOfActions:number;
    amount:number;
    status: 'executed' | 'pending' | 'cancelled';
    transactionType: 'buy' | 'sell';
}

export class Portofolio{
    userId:string;
    symbol:string;
    symbolId:string;
    type:'stock' | 'crypto';
    nrOfAction:number;
    investedAmount:number;
};


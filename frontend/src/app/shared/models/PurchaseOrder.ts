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
    type:'stock' | 'crypto';
    nrOfActions:number;
    investedAmount:number;
};


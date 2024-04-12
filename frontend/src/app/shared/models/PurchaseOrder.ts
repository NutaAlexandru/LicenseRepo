export class PurchaseOrder{
    userId: string;
    date: Date;
    stockSymbol:string;
    stockPrice:number;
    stockId:string;
    nrOfActions:number;
    amount:number;
    status: 'executed' | 'pending' | 'cancelled';
    transactionType: 'buy' | 'sell';
}

export class Portofolio{
    userId:string;
    stockSymbol:string;
    type:'stock' | 'crypto';
    nrOfActions:number;
    investedAmount:number;
};


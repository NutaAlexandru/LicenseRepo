export class Transactions{
    id:string;
    transactionId:string;
    user: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
    date: Date;
}
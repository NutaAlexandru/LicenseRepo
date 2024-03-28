import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transactions } from '../shared/models/Transaction';
import { Observable } from 'rxjs';
import {TRANSACTION_INFO_CREATE,TRANSACTION_INFO_UPDATE} from '../shared/constants/urls'

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http:HttpClient) { }

  createTransaction(transactionData: Transactions): Observable<Transactions> {
    return this.http.post<Transactions>(TRANSACTION_INFO_CREATE, transactionData);
  }
  updateBalance(transactionData: Transactions): Observable<Transactions> {
    return this.http.put<Transactions>(TRANSACTION_INFO_UPDATE, transactionData);
}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transactions } from '../shared/models/Transaction';
import { Observable, tap } from 'rxjs';
import {TRANSACTION_INFO_CREATE,TRANSACTION_INFO_GET_ALL,TRANSACTION_INFO_UPDATE,} from '../shared/constants/urls'
import { UserService } from './user.service';
import { User } from '../shared/models/User';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http:HttpClient,private userService:UserService,private toastrService:ToastrService) { }

  createTransaction(transactionData: Transactions): Observable<Transactions> {
    return this.http.post<Transactions>(TRANSACTION_INFO_CREATE, transactionData);
  }
  updateBalance(transactionData: Transactions): Observable<Transactions> {
    return this.http.put<any>(TRANSACTION_INFO_UPDATE, transactionData);
  }
  getTransactions(user:User):Observable<Transactions[]>{
    return this.http.get<Transactions[]>(TRANSACTION_INFO_GET_ALL+user.id);
  }
}

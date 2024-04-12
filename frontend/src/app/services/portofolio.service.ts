import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Portofolio, PurchaseOrder } from '../shared/models/PurchaseOrder';
import {PURCHASE_INFO_GET_ALL_URL,PORTOFOLIO_INFO_GET_ALL_URL} from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortofolioService {

  constructor(private http: HttpClient) { }

  getUserPurchaseOrders(userId: string):Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(PURCHASE_INFO_GET_ALL_URL+userId);
  }

  getUserPortofolio(userId: string):Observable<Portofolio[]> {
    return this.http.get<Portofolio[]>(PORTOFOLIO_INFO_GET_ALL_URL+userId);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Portofolio, PurchaseOrder } from '../shared/models/PurchaseOrder';
import {PURCHASE_INFO_GET_ALL_URL,PORTOFOLIO_INFO_GET_ALL_URL,PORTOFOLIO_SELL_URL, PORTOFOLIO_INFO_GET_ALL} from '../shared/constants/urls';
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

  sellStock(payload: any): Observable<any> {
    return this.http.post(PORTOFOLIO_SELL_URL,payload);
  }
  getPortfolioStats(userId: string): Observable<any> {
    return this.http.get<any>(PORTOFOLIO_INFO_GET_ALL+userId);
  }
}

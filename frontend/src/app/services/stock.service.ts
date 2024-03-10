import { Injectable } from '@angular/core';
import { Stock } from '../shared/models/Stock';
import { Observable } from 'rxjs';
import { STOCKS_URL, STOCK_SEARCH_URL,STOCK_BY_ID_URL } from '../shared/constants/urls';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http:HttpClient) { }

  getAllStocks():Observable<Stock[]>{
    return this.http.get<Stock[]>(STOCKS_URL);
  }

  getAllStocksBySearchTerm(searchTerm:string){
    return this.http.get<Stock[]>(STOCK_SEARCH_URL+searchTerm);
  }

  getStocksById(id:string):Observable<Stock>{
    return this.http.get<Stock>(STOCK_BY_ID_URL+id);
  }

}

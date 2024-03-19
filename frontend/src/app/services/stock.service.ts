import { Injectable } from '@angular/core';
import { Stock } from '../shared/models/Stock';
import { Observable, map } from 'rxjs';
import { STOCKS_URL, STOCK_SEARCH_URL,STOCK_BY_ID_URL, STOCK_HISTORIC } from '../shared/constants/urls';
import { HttpClient } from '@angular/common/http';
import { IHistory } from '../shared/interfaces/IHistory';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http:HttpClient) { 
  }
  getHistoricalData(stockSymbol: string): Observable<IHistory[]> {
    return this.http.get<IHistory[]>(STOCK_HISTORIC+stockSymbol).pipe(
      map(response => response)
    );
  } 

  getAllStocks():Observable<Stock[]>{
    return this.http.get<Stock[]>(STOCKS_URL);
  }

  getAllStocksBySearchTerm(searchTerm:string){
    return this.http.get<Stock[]>(STOCK_SEARCH_URL+searchTerm);
  }

  getStocksById(id:string):Observable<Stock>{
    return this.http.get<Stock>(STOCK_BY_ID_URL+id);
  }

  

  // getHistoricalData(stockSymbol: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${STOCK_HISTORIC}${stockSymbol}`).pipe(
  //     map(response => response)
  //   );
  // }   
  

}

import { Injectable } from '@angular/core';
import { Stock } from '../shared/models/Stock';
import { Observable, map } from 'rxjs';
import { 
  STOCKS_URL,
  STOCK_SEARCH_URL,
  STOCK_BY_ID_URL,
  STOCK_HISTORIC,
  COMPANYINFO,
  STOCKMARKETDATA,
  STOCKPRICECHANGE,
  MARKET_BIGGEST_GAINERS_URL,
  MARKET_BIGGEST_LOOSER_URL,
  MARKET_MOST_ACTIVE_URL,
  STOCK_LOGO_URL,
  PURCHASE_INFO_CREATE, 
  STOCKPRICE} from '../shared/constants/urls';
import { HttpClient } from '@angular/common/http';
import { IHistory } from '../shared/interfaces/IHistory';
import { ICompanyInfo} from '../shared/interfaces/ICompanyInfo'
import { IStockMarketData } from '../shared/interfaces/IStockMarketData';
import { IStockPerformance } from '../shared/interfaces/IStockPerformance';
import { IStockTop } from '../shared/interfaces/IStockTop';
import { PurchaseOrder } from '../shared/models/PurchaseOrder';

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

  getCompanyProfile(stockSymbol:string) :Observable<ICompanyInfo[]>{
    return this.http.get<ICompanyInfo[]>(COMPANYINFO+stockSymbol).pipe(
      map(response => response)
    );
  } 

  getMarketData(stockSymbol:string) :Observable<IStockMarketData[]>{
    return this.http.get<IStockMarketData[]>(STOCKMARKETDATA+stockSymbol).pipe(
      map(response => response)
    );
  } 

  getPriceChange(stockSymbol:string) :Observable<IStockPerformance[]>{
    return this.http.get<IStockPerformance[]>(STOCKPRICECHANGE+stockSymbol).pipe(
      map(response => response)
    );
  } 
  getPrice(stockSymbol:string):Observable<number>{
    return this.http.get<number>(STOCKPRICE+stockSymbol).pipe(
      map(response => response)
    );
  } 

  getMarketBiggestGainers():Observable<IStockTop[]>{
    return this.http.get<IStockTop[]>(MARKET_BIGGEST_GAINERS_URL).pipe(
      map(response => response)
    );
  }

  getMarketBiggestLooser():Observable<IStockTop[]>{
    return this.http.get<IStockTop[]>(MARKET_BIGGEST_LOOSER_URL).pipe(
      map(response => response)
    );
  }

  getMarketMostActive():Observable<IStockTop[]>{
    return this.http.get<IStockTop[]>(MARKET_MOST_ACTIVE_URL).pipe(
      map(response => response)
    );
  }

  createPurchaseOrder(purchaseOrderData:PurchaseOrder): Observable<PurchaseOrder> {
    
    return this.http.post<PurchaseOrder>(PURCHASE_INFO_CREATE, purchaseOrderData);
  }
      
}

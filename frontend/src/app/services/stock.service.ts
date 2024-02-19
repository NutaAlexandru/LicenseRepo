import { Injectable } from '@angular/core';
import { Stock } from '../shared/models/Stock';
import { sample_stocks } from '../../data';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor() { }

  getAllStocks():Stock[]{
    return sample_stocks;
  }

  getAllStocksBySearchTerm(searchTerm:string){
    return sample_stocks.filter(stock => stock.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  getStocksById(id:string):Stock{
    return this.getAllStocks().find(stock => stock.id === id) ?? new Stock();
  }

}

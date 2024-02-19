import { Component } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../services/stock.service';

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.css'
})
export class StockPageComponent {
  stock!:Stock;

  constructor(activatedRoute:ActivatedRoute,stockService:StockService){
    activatedRoute.params.subscribe(params => {
      if(params.id){
        this.stock = stockService.getStocksById(params.id);
      }
    });
  }

}

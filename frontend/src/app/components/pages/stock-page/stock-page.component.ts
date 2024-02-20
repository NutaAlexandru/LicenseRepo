import { Component } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [NotFoundComponent,CommonModule],
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

import { Component } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { StockService } from '../../../services/stock.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../partials/search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  stocks:Stock[] = [];
  constructor(private stockService:StockService,private activatedRoute:ActivatedRoute) {
    activatedRoute.params.subscribe(params => {
      if(params.searchTerm){
        this.stocks = this.stockService.getAllStocksBySearchTerm(params.searchTerm);
      }
      else{
        this.stocks = this.stockService.getAllStocks();
        }
    })
  }
}

import { Component } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { StockService } from '../../../services/stock.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../partials/search/search.component';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-home',
  standalone: true,
  providers: [StockService],
  imports: [HttpClientModule,RouterModule,CommonModule,SearchComponent,NotFoundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  stocks:Stock[] = [];
  constructor(private stockService:StockService,private activatedRoute:ActivatedRoute) {
    let stocksObs:Observable<Stock[]>;
    activatedRoute.params.subscribe(params => {
      if(params.searchTerm){
        stocksObs = this.stockService.getAllStocksBySearchTerm(params.searchTerm);
        
      }
      else{
        stocksObs = this.stockService.getAllStocks();
        
        }

      stocksObs.subscribe((serverStocks)=>
      {
        this.stocks = serverStocks;
      }
      )
    })
  }
  
}

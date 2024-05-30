import { Component } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { StockService } from '../../../services/stock.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../partials/search/search.component';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from '../../partials/loading/loading.component';
@Component({
  selector: 'app-stocks',
  standalone: true,
  providers: [StockService],
  imports: [HttpClientModule,RouterModule,CommonModule,SearchComponent,NotFoundComponent,LoadingComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  isSearchOn:boolean=true;
  stocks:Stock[] = [];
  displayLimit = 10;
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
  onToggleFavorite(stock: Stock) {
    console.log(stock);
    this.stockService.toggleFavorite(stock.id).subscribe({
      next: updatedStock => {
        console.log('Favorite toggled', updatedStock);
        stock.favorite = !stock.favorite; 
      },
      error: error => console.error('Error toggling favorite:', error)
    });
  }

  showMore(): void {
    this.displayLimit += 10;
  }
  
  
}

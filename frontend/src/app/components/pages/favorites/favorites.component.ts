import { Component } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { StockService } from '../../../services/stock.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../partials/search/search.component';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { LoadingComponent } from '../../partials/loading/loading.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [HttpClientModule,RouterModule,CommonModule,SearchComponent,NotFoundComponent,LoadingComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  isSearchOn:boolean=true;  
  stocks:Stock[];
  constructor(private stockService:StockService,private activatedRoute:ActivatedRoute)
  {}
  ngOnInit() {
    this.loadFavoriteStocks();
  }

  loadFavoriteStocks() {
    this.stockService.getFavoriteStocks()
      .pipe(
        catchError(error => {
          console.error('Error fetching favorite stocks', error);
          throw error;
        })
      )
      .subscribe(stocks => {
        this.stocks = stocks; // Stocarea datelor în array
      });
  }
  onToggleFavorite(stock: Stock) {
    console.log(stock);
    this.stockService.toggleFavorite(stock.id).subscribe({
      next: updatedStock => {
        this.loadFavoriteStocks();

      },
      error: error => console.error('Error toggling favorite:', error)
    });
  }
}

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
import { StocksComponent } from '../stocks/stocks.component';
import { CryptoComponent } from '../crypto/crypto.component';



@Component({
  selector: 'app-home',
  standalone: true,
  providers: [StockService],
  imports: [HttpClientModule,RouterModule,CommonModule,SearchComponent,NotFoundComponent,LoadingComponent,StocksComponent,CryptoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentComponent: string | null = null;
  
}

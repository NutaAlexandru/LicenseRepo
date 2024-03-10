import { Component } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-stock-page',
  standalone: true,
  providers: [StockService],
  imports: [HttpClientModule,NotFoundComponent,CommonModule],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.css'
})
export class StockPageComponent {
  stock!:Stock;

  constructor(activatedRoute:ActivatedRoute,stockService:StockService){
    activatedRoute.params.subscribe(params => {
      if(params.id){
        stockService.getStocksById(params.id).subscribe((serverStock)=>{
          this.stock = serverStock;
        });
      }
    });
  }

}

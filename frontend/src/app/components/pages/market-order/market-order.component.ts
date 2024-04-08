import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { StockService } from '../../../services/stock.service';
import { IStockTop } from '../../../shared/interfaces/IStockTop';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';

@Component({
  selector: 'app-market-order',
  standalone: true,
  providers:[StockService],
  imports: [
    CommonModule,
    NotFoundComponent
  ],
  templateUrl: './market-order.component.html',
  styleUrl: './market-order.component.css'
})
export class MarketOrderComponent {
  @Input() selectedList:string;
  data: IStockTop[] = [];
  constructor(private stockService:StockService,private cdRef: ChangeDetectorRef){
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedList']) {
      this.loadData();
    }
  }
  loadData() {
    switch (this.selectedList) {
      case 'Gainers':
        this.stockService.getMarketBiggestGainers().subscribe(data => {this.data = data;this.cdRef.detectChanges(); });
        break;
      case 'Losers':
        this.stockService.getMarketBiggestLooser().subscribe(data => {this.data = data;this.cdRef.detectChanges(); });
        break;
      case 'Active':
        this.stockService.getMarketMostActive().subscribe(data => {this.data = data;this.cdRef.detectChanges(); });
        break;
        
    }
    console.log(this.selectedList);
  }
}

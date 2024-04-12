import { Component, OnInit, ViewChild } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { CommonModule, getLocaleDateFormat } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HighchartsChartModule } from 'highcharts-angular';
import * as  Highcharts from 'highcharts/highstock';
import { ICompanyInfo } from '../../../shared/interfaces/ICompanyInfo';
import { IStockMarketData } from '../../../shared/interfaces/IStockMarketData';
import { IStockPerformance } from '../../../shared/interfaces/IStockPerformance';
import { FormsModule } from '@angular/forms';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-stock-page',
  standalone: true,
  providers: [StockService,UserService,ToastrService],
  imports: [
    HttpClientModule,
    NotFoundComponent,
    CommonModule,
    HighchartsChartModule,
    NgbModule,
    FormsModule,
  ],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.css'
})
export class StockPageComponent implements OnInit{
  stock!:Stock;
  companyProfile!: ICompanyInfo;
  marketData!:IStockMarketData;
  priceChange!:IStockPerformance;

  purchaseAmount: number = 0; // Suma introdusă de utilizator
  modalRef!: NgbModalRef; // Referința la modal

  user:User;

  @ViewChild('buyModal') buyModal: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(
    private activatedRoute:ActivatedRoute,
    private stockService:StockService,
    private modalService:NgbModal,
    private userService:UserService,)
    {
      userService.userObservable.subscribe((newUser)=>{
        this.user = newUser;
    }
  )}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id) {
        this.stockService.getStocksById(params.id).subscribe((stockData) => {
          this.stock = stockData;
          //this.loadChartData();
          this.loadCompanyProfile(this.stock.symbol);
          this.loadMarketData(this.stock.symbol);
          this.loadPriceChange(this.stock.symbol);
          
        });
      }
    });
  }

  openBuyModal() {
    this.modalRef = this.modalService.open(this.buyModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  getMaximumShares(amount: number): number {
    if (!this.companyProfile || !this.companyProfile.price) {
      return 0;
    }
    return amount / this.companyProfile.price;
  }

  buyStock() {
    if (!this.companyProfile) {
      // Gestionează cazul în care profilul companiei nu este încărcat
      console.error('Company profile is not loaded.');
      return;
    }
    if(this.user.balance<this.purchaseAmount)
    {
      
    }
    enum PurchaseOrderStatus {
      Pending = 'pending',
      Executed = 'executed',
      Cancelled = 'cancelled',
    }
    enum PurchaseOrderType{
      Buy = 'buy',
      Sell = 'sell',
    }
  
    const purchaseOrderData = {
      userId: this.user.id,
      date:new Date(),
      stockSymbol: this.companyProfile.symbol,
      stockPrice: this.companyProfile.price,
      stockId: this.stock.id,
      nrOfActions: this.getMaximumShares(this.purchaseAmount),
      amount: this.purchaseAmount,
      status: PurchaseOrderStatus.Pending,
      transactionType:PurchaseOrderType.Buy
      // Restul câmpurilor dacă sunt necesare și nu sunt setate prin valori implicite în backend
    };
  
    this.stockService.createPurchaseOrder(purchaseOrderData).subscribe({
      next: (response) => {
        // Aici poți să gestionezi succesul tranzacției
        console.log('Purchase order created:', response);
        this.modalService.dismissAll(); // Închide modalul după succes
      },
      error: (error) => {
      }
    });
  }
  

  loadChartData(): void {
    console.log(this.stock.symbol);
    if (this.stock && this.stock.symbol) {
      this.stockService.getHistoricalData(this.stock.symbol).subscribe(data => {
        
        this.chartOptions = {
          title: {
            text: `${this.stock.symbol} Historical Stock Price`
          },
          chart: {
          
            renderTo: 'container'
        },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              hour: '%H:%M', // formatul pentru ore
          },
          title: {
            text: 'day'
          },
          tickInterval: 3600 * 1000,
          },
          yAxis: {
            title: {
              text: 'Price',
              
            }
          },
          
          series: [{
            name: `${this.stock.symbol} Stock Price`,
            data: data.map(item => [new Date(item.date).getTime(), item.close],),
            type: 'line'
          }]
        };
      });
    }
  }
  loadCompanyProfile(symbol: string): void {
    this.stockService.getCompanyProfile(symbol).subscribe(companyProfile => {
      this.companyProfile = companyProfile[0]; // Salvează profilul companiei în proprietatea componentei
    });
  }
  loadMarketData(symbol: string): void {
    this.stockService.getMarketData(symbol).subscribe(marketData => {
      this.marketData = marketData; 
    });
  }
  loadPriceChange(symbol: string): void {
    this.stockService.getPriceChange(symbol).subscribe((priceChange:IStockPerformance) => {
      this.priceChange = priceChange; 
    });
  }
}

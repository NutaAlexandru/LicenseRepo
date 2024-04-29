import { Component, OnInit, ViewChild } from '@angular/core';
import { PortofolioService } from '../../../services/portofolio.service';
import { Portofolio } from '../../../shared/models/PurchaseOrder';
import { PurchaseOrder } from '../../../shared/models/PurchaseOrder';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../services/stock.service';
import { response } from 'express';
import { Observable } from 'rxjs';
import { ICompanyInfo } from '../../../shared/interfaces/ICompanyInfo';

import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../shared/models/User';
import { FormsModule } from '@angular/forms';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

export interface ExtendedPurchaseOrder extends PurchaseOrder {
  currentPrice: number;
  currentValue: number;
  percentChange: number;
}
export interface ExtendedPortfolioItem  extends Portofolio {
  currentPrice: number;
  currentValue: number;
  percentChange: number;
}



@Component({
  selector: 'app-portofolio-page',
  standalone: true,
  providers:[
    UserService,
    PortofolioService,
    ToastrService,
    StockService
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    HighchartsChartModule

  ],
  templateUrl: './portofolio-page.component.html',
  styleUrl: './portofolio-page.component.css'
})
export class PortofolioPageComponent implements OnInit {
  stocksAmount:number;
  cryptoAmount:number=3;
  etfAmount:number=4;
  portfolioValue: number = 0; // Valoarea cumulativă a acțiunilor deținute
  sellAmount: number = 0;
  purchaseOrders: PurchaseOrder[] = [];
  portfolioItems: ExtendedPortfolioItem[] = [];
  selectedStock: ExtendedPortfolioItem | null = null;

  modalRef!: NgbModalRef; // Referința la modal
  @ViewChild('sellModal') sellModal: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options ={}
  loadChart(){
    this.chartOptions= {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Stocks, Crypto, and ETF Distribution'
      },
      series: [{
        type: 'pie', // Specificați tipul de grafic pentru seria de date
        name: 'Assets',
        data: [
          {
            name: 'Stocks',
            y: this.stocksAmount
             // Variabila care stochează valoarea acțiunilor
          },
          {
            name: 'Crypto',
            y: this.cryptoAmount // Variabila care stochează valoarea criptomonedelor
          },
          {
            name: 'ETF',
            y: this.etfAmount // Variabila care stochează valoarea ETF-urilor
          }
        ]
      }]
    };
  }

  user:User=this.userService.currentUser;
  companyProfile:ICompanyInfo
  constructor(
    private portfolioService: PortofolioService,
    private userService:UserService,
    private stockService:StockService,
    private modalService: NgbModal,
  ){
  }

  ngOnInit(): void {
    this.loadPortfolio();
    this.loadOrders();
    console.log(this.portfolioItems.length);
    console.log(this.portfolioItems);
    this.stocksAmount=this.portfolioItems.length;
    this.loadChart();
    
  }

  
  loadCompanyProfile(symbol: string): void {
    this.stockService.getCompanyProfile(symbol).subscribe(companyProfile => {
      this.companyProfile = companyProfile[0];
    });
  }
  loadPortfolio() {
    this.portfolioService.getUserPortofolio(this.user.id).subscribe(portfolioItems => {
      
      console.log(portfolioItems.length);
      const portfolioObservables = portfolioItems.map(item =>
        this.stockService.getCompanyProfile(item.stockSymbol).pipe(
          map(profile => ({
            ...item,
            currentPrice: profile[0].price, // Presupunem că getCompanyProfile întoarce direct profilul
            currentValue: profile[0].price * item.nrOfActions,
            percentChange: (((profile[0].price * item.nrOfActions) - item.investedAmount) / item.investedAmount) * 100
          }))
        )
        
      );
      forkJoin(portfolioObservables).subscribe(extendedItems => {
        this.portfolioItems = extendedItems;
        this.portfolioValue = extendedItems.reduce((sum, currentItem) => sum + currentItem.currentValue, 0);
        const uniqueStocks = new Set(extendedItems.map(item => item.stockSymbol));
            this.stocksAmount = uniqueStocks.size;
            
      });
      
    });
    
  }
  loadOrders() {
    if (this.user && this.user.id) {
      this.portfolioService.getUserPurchaseOrders(this.user.id).subscribe({
        next: (orders) => {
          this.purchaseOrders = orders;
        },
        error: (error) => {
          console.error('Failed to load orders:', error);
        }
      });
    }
  }
  openSellModal(item: ExtendedPortfolioItem) {
    this.selectedStock = item;
    this.modalRef = this.modalService.open(this.sellModal, { ariaLabelledBy: 'modal-basic-title' });
  }
  sellStock() {
    if (!this.selectedStock) {
      console.error('No stock selected.');
      return;
    }
  
    const payload = {
      userId: this.user.id,
      stockSymbol: this.selectedStock.stockSymbol,
      nrOfAction: this.sellAmount,
      stockPrice: this.selectedStock.currentPrice,
    };
  
    this.portfolioService.sellStock(payload).subscribe({
      next: (response) => {
        //this.toastrService.success('Vânzarea a fost efectuată cu succes.');
        this.loadPortfolio();
        this.loadOrders();
        this.modalService.dismissAll();
      },
      error: (error:any) => {
      //  this.toastrService.error('Eroare la vânzarea acțiunilor.');
        console.error('Failed to sell stock:', error);
      }
    });
  }
  
}
  


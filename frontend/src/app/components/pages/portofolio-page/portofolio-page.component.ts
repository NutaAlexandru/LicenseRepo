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
import { HighchartsChartModule } from 'highcharts-angular';
import * as  Highcharts from 'highcharts/highstock';
import { CryptoService } from '../../../services/crypto.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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
    StockService,
    CryptoService
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    HighchartsChartModule,
    RouterModule,
    HttpClientModule

  ],
  templateUrl: './portofolio-page.component.html',
  styleUrl: './portofolio-page.component.css'
})
export class PortofolioPageComponent implements OnInit {
  stocksAmount:number;
  cryptoAmount:number;
  etfAmount:number=4;
  portfolioValue: number = 0; // Valoarea cumulativă a acțiunilor deținute
  sellAmount: number = 0;
  purchaseOrders: PurchaseOrder[] = [];
  portfolioItems: ExtendedPortfolioItem[] = [];
  selectedStock: ExtendedPortfolioItem | null = null;
  showChart: boolean = false;

  modalRef!: NgbModalRef; // Referința la modal
  @ViewChild('sellModal') sellModal: any;
  user!:User;
   Highcharts: typeof Highcharts = Highcharts;
   chartOptions: Highcharts.Options ={};
  

  companyProfile:ICompanyInfo
  constructor(
    private portfolioService: PortofolioService,
    private userService:UserService,
    private stockService:StockService,
    private modalService: NgbModal,
    private cryptoService: CryptoService,
  ){}
  

  ngOnInit(): void {
    this.userService.userObservable.subscribe((newUser)=>{
      this.user = newUser;
      console.log(this.user);
      this.loadFunctions();
    });
  }
  hideStats(){
    this.showChart = false;
  }
  loadFunctions(){
    this.loadPortfolio();
    this.loadOrders();
    this.loadPortfolioStats();
  }
  loadChartData() {

    const data = [
      { name: 'Stocks', y: this.stocksAmount, sliced: true, selected: true },
      { name: 'Cryptocurrencies', y: this.cryptoAmount }
    ];
    this.chartOptions = {
      chart: {
        type: 'pie'
    },
    title: {
        text: 'Distribution of assets in your portfolio'
    },
    series: [{
      type: 'pie',
      id: 'Stats',
      name: 'Stats',
      data: data
    }]
    };
    this.showChart = true;
  }

  loadPortfolioStats(): void {
    this.portfolioService.getPortfolioStats(this.user.id).subscribe( (data) => {
        this.stocksAmount = data.stocks;
        this.cryptoAmount = data.cryptos;
      });
  }

  
  loadCompanyProfile(symbol: string): void {
    this.stockService.getCompanyProfile(symbol).subscribe(companyProfile => {
      this.companyProfile = companyProfile[0];
    });
  }
  loadPortfolio() {
    this.portfolioService.getUserPortofolio(this.user.id).subscribe(portfolioItems => {
      const portfolioObservables = portfolioItems.map(item => {
        if (item.type === 'stock') {
          return this.stockService.getCompanyProfile(item.symbol).pipe(
            map(profile => ({
              ...item,
              currentPrice: profile[0].price,
              currentValue: profile[0].price * item.nrOfActions,
              percentChange: (((profile[0].price * item.nrOfActions) - item.investedAmount) / item.investedAmount) * 100
            }))
          );
        } else {
          return this.cryptoService.getData(item.symbol).pipe(
            map(profile => ({
              ...item,
              currentPrice: profile.price,
              currentValue: profile.price * item.nrOfActions, // Presupunem că în loc de 'nrOfActions' folosim 'nrOfTokens' pentru cripto
              percentChange: (((profile.price * item.nrOfActions) - item.investedAmount) / item.investedAmount) * 100
            }))
          );
        }
      });
      
      forkJoin(portfolioObservables).subscribe(extendedItems => {
        this.portfolioItems = extendedItems;
        this.portfolioValue = extendedItems.reduce((sum, currentItem) => sum + currentItem.currentValue, 0);
        const uniqueIdentifiers = new Set(extendedItems.map(item => item.symbol));
        this.stocksAmount = uniqueIdentifiers.size;
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
  displayLimit = 3;

  showMore(): void {
    this.displayLimit += 3;
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
      symbol: this.selectedStock.symbol,
      nrOfAction: this.sellAmount,
      price: this.selectedStock.currentPrice,
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

  getStocks() {
    return this.portfolioItems.filter(item => item.type === 'stock');
  }
  
  getCryptos() {
    return this.portfolioItems.filter(item => item.type === 'crypto');
  }
  
}
  


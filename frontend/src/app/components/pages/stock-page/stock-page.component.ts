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
import { IHistory } from '../../../shared/interfaces/IHistory';



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
  companyProfile!:ICompanyInfo;
  marketData!:IStockMarketData;
  priceChange!:IStockPerformance;

  purchaseAmount: number = 0;
  modalRef!: NgbModalRef; // Referința la modal
  @ViewChild('buyModal') buyModal: any;
  user:User;
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
          this.loadChartData(this.stock.symbol);
          this.loadCompanyProfile(this.stock.symbol);
          //this.loadMarketData(this.stock.symbol);
          //this.loadPriceChange(this.stock.symbol);
          
        });
      }
    });
  }
  loadPriceChange(symbol: string): void {
    this.stockService.getPriceChange(symbol).subscribe((priceChange) => {
      //console.log(priceChange[0]);
      this.priceChange = priceChange[0]; 
    });
  }
  loadCompanyProfile(symbol: string): void {
    this.stockService.getCompanyProfile(symbol).subscribe(companyProfile => {
      this.companyProfile = companyProfile[0];
    });
  }
  loadMarketData(symbol: string): void {
    this.stockService.getMarketData(symbol).subscribe(marketData => {
      this.marketData = marketData[0];
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
      symbol: this.companyProfile.symbol,
      price: this.companyProfile.price,
      id: this.stock.id,
      nrOfActions: this.getMaximumShares(this.purchaseAmount),
      amount: this.purchaseAmount,
      status: PurchaseOrderStatus.Pending,
      transactionType:PurchaseOrderType.Buy,
      type:'stock'
    };
  
    this.stockService.createPurchaseOrder(purchaseOrderData).subscribe({
      next: (response) => {
        console.log('Purchase order created:', response);
        this.modalService.dismissAll();
      },
      error: (error) => {
      }
    });
  }
  loadChartData(stockSymbol: string): void {
    this.stockService.getHistoricalData(stockSymbol).subscribe({
      next: (data) => {
        this.buildChart(data);
      },
      error: (error) => {
        console.error('Error retrieving stock data', error);
      }
    });
  }
  buildChart(stockData: IHistory[]): void {
    const ohlc = stockData.map(item => [
      new Date(item.date).toLocaleDateString('ro-RO'),
      parseFloat(item.open),
      parseFloat(item.high),
      parseFloat(item.low),
      parseFloat(item.close)
    ]);
    const volume = stockData.map(item => [
      new Date(item.date).toLocaleDateString('ro-RO'),
      parseInt(item.volume)
    ]);
    this.chartOptions = {
      yAxis: [{
        labels: {
          align: 'left'
        },
        height: '80%',
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'left'
        },
        top: '80%',
        height: '20%',
        offset: 0
      }],
      tooltip: {
        shape: 'callout',
        headerShape: 'callout',
        borderWidth: 0,
        shadow: false,
        positioner: function(width, height, point) {
          const chart = this.chart;
          let position;
  
          if (point.isHeader) {
            position = {
              x: Math.max(
                // Left side limit
                chart.plotLeft,
                Math.min(
                  point.plotX + chart.plotLeft - width / 2,
                  // Right side limit
                  chart.chartWidth - width - chart.options.chart.marginRight
                )
              ),
              y: point.plotY
            };
          } else {
            const yAxisPosition = point.series.yAxis.toPixels(point.y, true);
            position = {
              x: point.series.chart.plotLeft,
              y: yAxisPosition - chart.plotTop
            };
          }
  
          return position;
        }
      },
      series: [{
        type: 'ohlc',
        id: 'aapl-ohlc',
        name: 'AAPL Stock Price',
        data: ohlc
      }, {
        type: 'column',
        id: 'aapl-volume',
        name: 'AAPL Volume',
        data: volume,
        yAxis: 1
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 800
          },
          chartOptions: {
            rangeSelector: {
              inputEnabled: false
            }
          }
        }]
      }
    };
  }
  

  // loadChartData(): void {
  //   console.log(this.stock.symbol);
  //   if (this.stock && this.stock.symbol) {
  //     this.stockService.getHistoricalData(this.stock.symbol).subscribe(data => {
  //       // const ohlc = data.map(item => [
  //       //        new Date(item.date).getTime(),
  //       //        parseFloat(item.open),
  //       //        parseFloat(item.high),
  //       //        parseFloat(item.low),
  //       //        parseFloat(item.close)
  //       //      ]);
  //       this.chartOptions = {
  //         rangeSelector: {
  //           selected: 1},
  //           accessibility:{
  //             enabled:true
  //           },
  //         stockTools: {
  //           gui: {
  //               enabled: true // Activare instrumente de analiză
  //           }
  //       },
  //         title: {
  //             text: `${this.stock.symbol} Historical Stock Price`
  //         },
  //         xAxis: {
  //             type: 'datetime',
  //             dateTimeLabelFormats: {
  //                 hour: '%H:%M', // format for hours
  //             },
  //             title: {
  //                 text: 'Day'
  //             },
  //         },
  //         yAxis: {
  //             title: {
  //                 text: 'Price'
  //             }
  //         },
  //         series: [{
  //             name: `${this.stock.symbol} Stock Price`,
  //             data: data.map(item => [new Date(item.date).getTime(), item.close]),
  //             type: 'line'
  //         }]
  //     };
  //     });
  //   }
  // }
  
}

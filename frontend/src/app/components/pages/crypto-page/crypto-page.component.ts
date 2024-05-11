import { Component, OnInit, ViewChild } from '@angular/core';
import { CryptoModel } from '../../../shared/models/Crypto';
import * as  Highcharts from 'highcharts/highstock';
import { HighchartsChartModule } from 'highcharts-angular';
import { CryptoService } from '../../../services/crypto.service';
import { ActivatedRoute } from '@angular/router';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { ICryptoData } from '../../../shared/interfaces/ICryptoData';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IHistory } from '../../../shared/interfaces/IHistory';
@Component({
  selector: 'app-crypto-page',
  standalone: true,
  providers:[CryptoService,
    UserService,
    ToastrService
  ],
  imports: [HighchartsChartModule,
  NotFoundComponent,
  CommonModule,
  FormsModule,],
  templateUrl: './crypto-page.component.html',
  styleUrl: './crypto-page.component.css'
})
export class CryptoPageComponent implements OnInit {
    crypto!:CryptoModel;
    cryptoData!:ICryptoData;
    user:User;

    purchaseAmount: number = 0;
    modalRef!: NgbModalRef; // Referința la modal
    @ViewChild('buyModal') buyModal: any;

    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options = {};

    constructor(private activatedRoute:ActivatedRoute,
      private cryptoService:CryptoService,
      private modalService:NgbModal,
      private userService:UserService){
        userService.userObservable.subscribe((newUser)=>{
          this.user = newUser;
      });
    }
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        if (params.id) {
          this.cryptoService.getCryptosById(params.id).subscribe((cryptoData) => {
            this.crypto = cryptoData;
            this.resetChartData();
            this.loadChartData(this.crypto.symbol);
            this.loadCryptoData(this.crypto.symbol);
          });
        }
      });
    }
    resetChartData() {
      this.chartOptions = {}; // Reset chart options to initial state
    }
    
    loadChartData(stockSymbol: string): void {
      this.cryptoService.getHistoricalData(stockSymbol).subscribe(
        data => {
          const ohlc = data.map(item => [
            (new Date(item.date)).getTime(), // Convert date to timestamp
            parseFloat(item.open),
            parseFloat(item.high),
            parseFloat(item.low),
            parseFloat(item.close)
          ]);
          const volume = data.map(item => [
            (new Date(item.date)).getTime(), // Convert date to timestamp
            parseInt(item.volume)
          ]);
    
          // Build the chart options directly in the subscribe
          this.chartOptions = {
            stockTools: {
              gui: {
                enabled: true // enable or disable the stockTools GUI
              }
            },
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
                      chart.plotLeft,
                      Math.min(
                        point.plotX + chart.plotLeft - width / 2,
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
              type: 'line',
              id: `${stockSymbol}-ohlc`, // Ensure dynamic ID
              name: `${stockSymbol} Price`,
              data: ohlc
            }, {
              type: 'column',
              id: `${stockSymbol}-volume`, // Ensure dynamic ID
              name: `${stockSymbol} Volume`,
              data: volume,
              yAxis: 1
            }],
            responsive: {
              rules: [{
                condition: {
                  //maxWidth: 800
                },
                chartOptions: {
                  rangeSelector: {
                    inputEnabled: true,
                  }
                }
              }]
            }
          };
        },
        error => {
          console.error('Error retrieving stock data', error);
        }
      );
    }
    loadCryptoData(symbol: string): void {
      if (symbol) {
        this.cryptoService.getData(symbol).subscribe(cryptoData => {
          this.cryptoData = cryptoData;
        });
      }
    }
    openBuyModal() {
      this.modalRef = this.modalService.open(this.buyModal, { ariaLabelledBy: 'modal-basic-title' });
    }
    buyCrypto() {
      if (!this.cryptoData) {
          console.error('Crypto profile is not loaded.');
          return;
      }
      if (this.user.balance < this.purchaseAmount) {
          console.error('Insufficient balance to make the purchase.');
          return;
      }
      
      enum PurchaseOrderStatus {
          Pending = 'pending',
          Executed = 'executed',
          Cancelled = 'cancelled',
      }
      
      enum PurchaseOrderType {
          Buy = 'buy',
          Sell = 'sell',
      }
    
      const purchaseOrderData = {
          userId: this.user.id,
          date: new Date(),
          symbol: this.cryptoData.symbol, // Se referă la simbolul criptomonedei
          price: this.cryptoData.price, // Prețul actual al criptomonedei
          id: this.crypto.id, // Identificatorul unic pentru criptomoneda în cadrul aplicației tale
          nrOfActions: this.getMaximumTokens(this.purchaseAmount), // Calcularea numărului maxim de tokenuri ce pot fi cumpărate cu suma disponibilă
          amount: this.purchaseAmount,
          status: PurchaseOrderStatus.Pending,
          transactionType: PurchaseOrderType.Buy,
          type: 'crypto' // Specificăm că este o tranzacție cu criptomonede
      };
    
      this.cryptoService.createPurchaseOrder(purchaseOrderData).subscribe({
          next: (response) => {
              console.log('Crypto purchase order created:', response);
              this.modalService.dismissAll(); // Închide modalul după succes
          },
          error: (error) => {
              console.error('Failed to create crypto purchase order:', error);
          }
      });
  }
  getMaximumTokens(amount: number): number {
    if (!this.cryptoData || !this.cryptoData.price) {
        console.error('Crypto profile or price is not loaded.');
        return 0; // Returnează 0 dacă profilul criptomonedei nu este încărcat sau dacă prețul nu este disponibil
    }
    return Math.floor(amount / this.cryptoData.price); // Utilizează Math.floor pentru a asigura că numărul de tokeni este întreg
}
}

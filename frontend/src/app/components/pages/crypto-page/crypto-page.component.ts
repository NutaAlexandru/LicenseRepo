import { Component, OnInit } from '@angular/core';
import { CryptoModel } from '../../../shared/models/Crypto';
import * as  Highcharts from 'highcharts/highstock';
import { HighchartsChartModule } from 'highcharts-angular';
import { CryptoService } from '../../../services/crypto.service';
import { ActivatedRoute } from '@angular/router';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { ICryptoData } from '../../../shared/interfaces/ICryptoData';
@Component({
  selector: 'app-crypto-page',
  standalone: true,
  providers:[CryptoService],
  imports: [HighchartsChartModule,
  NotFoundComponent,
  CommonModule],
  templateUrl: './crypto-page.component.html',
  styleUrl: './crypto-page.component.css'
})
export class CryptoPageComponent implements OnInit {
    crypto!:CryptoModel;
    cryptoData:ICryptoData;

    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options = {};

    constructor(private activatedRoute:ActivatedRoute,private cryptoService:CryptoService){

    }
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        if (params.id) {
          this.cryptoService.getCryptosById(params.id).subscribe((cryptoData) => {
            this.crypto = cryptoData;
            //this.loadChartData();
            this.loadCryptoData(this.crypto.symbol);
            console.log(this.cryptoData);
          });
          
        }
      });
    }
    
    loadChartData(): void {
      //console.log(this.crypto.symbol);
      if (this.crypto && this.crypto.symbol) {
        this.cryptoService.getHistoricalData(this.crypto.symbol).subscribe(data => {
          this.chartOptions = {
            title: {
              text: `${this.crypto.symbol} Historical Cryptocurrency Price`
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
              name: `${this.crypto.symbol} Cryptocurrency Price`,
              data: data.map(item => [new Date(item.date).getTime(), item.close]),
              type: 'line'
            }]
          };
        });
      }
    }
    loadCryptoData(symbol: string): void {
      if (symbol) {
        this.cryptoService.getData(symbol).subscribe(cryptoData => {
          this.cryptoData = cryptoData;
        });
      }
    }
}

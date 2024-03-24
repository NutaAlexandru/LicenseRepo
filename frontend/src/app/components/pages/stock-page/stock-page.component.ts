import { Component, OnInit } from '@angular/core';
import { Stock } from '../../../shared/models/Stock';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../services/stock.service';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { HighchartsChartModule } from 'highcharts-angular';
import * as  Highcharts from 'highcharts/highstock';
import { ICompanyInfo } from '../../../shared/interfaces/ICompanyInfo';
import { IStockMarketData } from '../../../shared/interfaces/IStockMarketData';


@Component({
  selector: 'app-stock-page',
  standalone: true,
  providers: [StockService],
  imports: [HttpClientModule,NotFoundComponent,CommonModule,HighchartsChartModule],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.css'
})
export class StockPageComponent implements OnInit{
  stock!:Stock;
  companyProfile!: ICompanyInfo
  marketData!:IStockMarketData;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(private activatedRoute:ActivatedRoute,private stockService:StockService){
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id) {
        this.stockService.getStocksById(params.id).subscribe((stockData) => {
          this.stock = stockData;
          this.loadChartData();
          this.loadCompanyProfile(this.stock.symbol);
          this.loadMarketData(this.stock.symbol);
        });
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
      this.marketData = marketData[0]; 
    });
  }
}

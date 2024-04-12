import { Component, OnInit } from '@angular/core';
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

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../shared/models/User';

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
    CommonModule

  ],
  templateUrl: './portofolio-page.component.html',
  styleUrl: './portofolio-page.component.css'
})
export class PortofolioPageComponent implements OnInit {
  portfolioValue: number = 0; // Valoarea cumulativă a acțiunilor deținute

  purchaseOrders: PurchaseOrder[] = [];
  portfolioItems: ExtendedPortfolioItem[] = [];

  user:User;
  companyProfile:ICompanyInfo
  constructor(
    private portfolioService: PortofolioService,
    private userService:UserService,
    private stockService:StockService
  ){
    userService.userObservable.subscribe((newUser)=>{
      this.user = newUser;
    })
  }

  ngOnInit(): void {
    this.loadPortfolio();
    this.loadOrders();
  }

  
  loadCompanyProfile(symbol: string): void {
    this.stockService.getCompanyProfile(symbol).subscribe(companyProfile => {
      this.companyProfile = companyProfile[0];
    });
  }
  loadPortfolio() {
    this.portfolioService.getUserPortofolio(this.user.id).subscribe(portfolioItems => {
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
}
  


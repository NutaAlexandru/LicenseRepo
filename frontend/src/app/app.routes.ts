
import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { StockPageComponent } from './components/pages/stock-page/stock-page.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { FirstPageComponent } from './components/pages/first-page/first-page.component';
import { DividentsComponent } from './components/pages/dividents/dividents.component';
import { NewsComponent } from './components/pages/news/news.component';
import { StocksComponent } from './components/pages/stocks/stocks.component';
import { CryptoComponent } from './components/pages/crypto/crypto.component';
import { CryptoPageComponent } from './components/pages/crypto-page/crypto-page.component';

export const routes: Routes = [
    {path:'hello',component:FirstPageComponent},
    {path:'',component:HomeComponent},
    {path:'demo',component:HomeComponent},
    {path:'search/:searchTerm',component:StocksComponent},
    {path:'stock/:id',component:StockPageComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'dividents',component:DividentsComponent},
    {path:'news',component:NewsComponent},
    {path:'stocks',component:StocksComponent},
    {path:'cryptos',component:CryptoComponent},
    {path:'crypto/:id',component:CryptoPageComponent},
];



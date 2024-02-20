
import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { StockPageComponent } from './components/pages/stock-page/stock-page.component';
import { LoginComponent } from './components/pages/login/login.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'demo',component:HomeComponent},
    {path:'search/:searchTerm',component:HomeComponent},
    {path:'stock/:id',component:StockPageComponent},
    {path:'login',component:LoginComponent}
];



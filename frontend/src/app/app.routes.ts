
import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { StockPageComponent } from './components/pages/stock-page/stock-page.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { FirstPageComponent } from './components/pages/first-page/first-page.component';
import { DividentsComponent } from './components/pages/dividents/dividents.component';
import { NewsComponent } from './components/pages/news/news.component';

export const routes: Routes = [
    {path:'hello',component:FirstPageComponent},
    {path:'',component:HomeComponent},
    {path:'demo',component:HomeComponent},
    {path:'search/:searchTerm',component:HomeComponent},
    {path:'stock/:id',component:StockPageComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'dividents',component:DividentsComponent},
    {path:'news',component:NewsComponent}
];



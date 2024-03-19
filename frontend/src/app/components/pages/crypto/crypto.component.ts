import { Component} from '@angular/core';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { CommonModule } from '@angular/common';

import { CryptoService } from '../../../services/crypto.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CryptoModel } from '../../../shared/models/Crypto';
import { SearchComponent } from '../../partials/search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crypto-page',
  standalone: true,
  providers:[
    CryptoService
  ],
  imports: [
    NotFoundComponent,
    CommonModule,
    SearchComponent,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.css'
})
export class CryptoComponent{

  cryptos:CryptoModel[]=[];


  constructor(private activatedRoute:ActivatedRoute,private cryptoService:CryptoService){
    let cryptoObs:Observable<CryptoModel[]>
    activatedRoute.params.subscribe(params =>{
      if(params.searchTerm){
        cryptoObs = this.cryptoService.getAllCryptosBySearchTerm(params.searchTerm);
        
      }
      else{
        cryptoObs = this.cryptoService.getAllCryptos();  
        }

        cryptoObs.subscribe((serverCryptos)=>
      {
        this.cryptos = serverCryptos;
      }
      )
    })
  }
}

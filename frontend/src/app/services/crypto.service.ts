import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CryptoModel } from '../shared/models/Crypto';
import { CRYPTO_BY_ID_URL,CRYPTO_HISTORIC,CRYPTO_SEARCH_URL,CRYPTO_URL } from '../shared/constants/urls';

import { IHistory } from '../shared/interfaces/IHistory';
@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(private http:HttpClient) { }

  getHistoricalData(stockSymbol: string): Observable<IHistory[]> {
    return this.http.get<IHistory[]>(CRYPTO_HISTORIC+stockSymbol).pipe(
      map(response => response)
    );
  } 

  getAllCryptos():Observable<CryptoModel[]>{
    return this.http.get<CryptoModel[]>(CRYPTO_URL);
  }

  getAllCryptosBySearchTerm(searchTerm:string){
    return this.http.get<CryptoModel[]>(CRYPTO_SEARCH_URL+searchTerm);
  }

  getCryptosById(id:string):Observable<CryptoModel>{
    return this.http.get<CryptoModel>(CRYPTO_BY_ID_URL+id);
  }


}

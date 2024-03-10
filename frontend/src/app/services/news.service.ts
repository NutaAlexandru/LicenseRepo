import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { INews } from '../shared/interfaces/INews';
import { NewsModel } from '../shared/models/News';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiUrl: string = 'https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=5&apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI';

  constructor(private http: HttpClient) { }

  // getNews(): Observable<INews[]> {
  //   return this.http.get<INews[]>(this.apiUrl);
  // }
  getNews(): Observable<INews[]> {
    return this.http.get<NewsModel>(this.apiUrl).pipe(
      map(response => response.content)
    );
  }
}

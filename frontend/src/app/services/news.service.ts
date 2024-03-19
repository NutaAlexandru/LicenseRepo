import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { INews } from '../shared/interfaces/INews';
import { NewsModel } from '../shared/models/News';
import { NEWS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private http: HttpClient) { }

  getNews(): Observable<INews[]> { 
    return this.http.get<NewsModel>(NEWS_URL).pipe(
      map(response => response.content)
    );
  }
}

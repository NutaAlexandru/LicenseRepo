import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDividend } from '../shared/interfaces/IDivident';
import { DIVIDENTS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class DividentService {

  constructor(private http: HttpClient) { }

  getDividendData(): Observable<IDividend[]> {
    return this.http.get<IDividend[]>(DIVIDENTS_URL);
  }
}

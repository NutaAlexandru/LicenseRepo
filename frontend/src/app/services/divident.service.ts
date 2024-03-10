import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDividend } from '../shared/interfaces/IDivident';

@Injectable({
  providedIn: 'root'
})
export class DividentService {

  private apiUrl: string = 'https://financialmodelingprep.com/api/v3/stock_dividend_calendar?from=2023-08-10&to=2023-08-10&apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI';

  constructor(private http: HttpClient) { }

  getDividendData(): Observable<IDividend[]> {
    return this.http.get<IDividend[]>(this.apiUrl);
  }
}

import { Component } from '@angular/core';
import { IDividend } from '../../../shared/interfaces/IDivident';
import { DividentService } from '../../../services/divident.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dividents',
  standalone: true,
  providers: [DividentService],
  imports: [CommonModule],
  templateUrl: './dividents.component.html',
  styleUrl: './dividents.component.css'
})
export class DividentsComponent {
  dividendData: IDividend[] = [];

  constructor(private dividendService: DividentService,private http:HttpClient) { }

  ngOnInit() {
    this.dividendService.getDividendData().subscribe(
      data => {
        this.dividendData = data;
      },
      error => {
        console.error('There was an error retrieving the dividend data!', error);
      }
    );
  }
}

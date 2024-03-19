import { Component, OnInit } from '@angular/core';
import { INews } from '../../../shared/interfaces/INews';
import { NewsService } from '../../../services/news.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-news',
  standalone: true,
  providers: [NewsService],
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  articles: INews[] = [];

  constructor(private newsService: NewsService,private http:HttpClient) { }

  ngOnInit(): void {
    this.newsService.getNews().subscribe(
      (data) => {
        this.articles = data;
      
      },
      (error) => {
        console.error('Error fetching news', error);
      }
    );
  }
}

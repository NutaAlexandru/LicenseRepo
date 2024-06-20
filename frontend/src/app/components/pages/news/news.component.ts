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
  pagedArticles: INews[] = [];
  currentPage: number = 1;
  pageSize: number = 6; // Numărul de articole pe pagină
  totalPages: number;
  pages: number[] = [];
  constructor(private newsService: NewsService,private http:HttpClient) { }

  ngOnInit(): void {
    this.newsService.getNews().subscribe(
      (data) => {
        this.articles = data;
        this.totalPages = Math.ceil(this.articles.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.setPage(this.currentPage);
      
      },
      (error) => {
        console.error('Error fetching news', error);
      }
    );
  }
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedArticles = this.articles.slice(startIndex, endIndex);
  }
}

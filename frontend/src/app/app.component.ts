import { Component,OnInit,AfterViewInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/partials/loading/loading.component';




@Component({
  selector: 'app-root',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule,HttpClientModule,RouterOutlet,HeaderComponent,HomeComponent,RouterModule,LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'frontend';
  isLoading = true;
  constructor(){
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  ngOnInit() {
  }


}

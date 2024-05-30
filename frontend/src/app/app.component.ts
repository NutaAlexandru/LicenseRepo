import { Component,OnInit,AfterViewInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/partials/loading/loading.component';
import { User } from './shared/models/User';
import { UserService } from './services/user.service';
import { FirstPageComponent } from './components/pages/first-page/first-page.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BackgroundService } from './services/background.service';





@Component({
  selector: 'app-root',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule,HttpClientModule,RouterOutlet,HeaderComponent,HomeComponent,RouterModule,LoadingComponent,FirstPageComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  title = 'frontend';
  isLoading = true;
  backgroundNumber: number;
  constructor(private backgroundService: BackgroundService){
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);

  }

  ngOnInit() {
    this.backgroundService.currentBackground.subscribe(index => {
      this.backgroundNumber = index;
      // Opțional, gestionează încărcarea aici dacă este necesar
      this.isLoading = false;
    });
  }


}

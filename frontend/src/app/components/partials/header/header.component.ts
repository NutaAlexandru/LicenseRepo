import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CoreModule } from '../../../modules/core/core.module';
import { NgModule } from '@angular/core';
import { Console } from 'console';
import { BackgroundService } from '../../../services/background.service';

@Component({
  selector: 'app-header',
  standalone: true,
  providers: [UserService,ToastrService],
  imports: [CoreModule,CommonModule,RouterModule,HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn=false;
  user!:User;
  constructor(private userService:UserService,private backgroundService:BackgroundService) {

    
  //  //console.log(this.user);
  //  console.log(this.isAuth);
  }
ngOnInit(){
  this.userService.userObservable.subscribe((newUser)=>{
    this.user = newUser;

  });
}
logout(){
  this.userService.logout();
}
get isAuth(){
  return this.user.token;
}
changeBackground(index: number) {
  this.backgroundService.changeBackground(index);
}
toggleDropdown(event: Event): void {
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  const parent = target.parentElement;

  if (parent) {
    parent.classList.toggle('show');
  }
}
switchToDemo() {
  if (this.user.email) {
    this.userService.switchToDemoAccount(this.user.email).subscribe({
      next: (demoUser) => {
        this.user = demoUser;
      },
      error: (err) => {
        console.error('Error switching to demo account', err);
      }
    });
  }
}
switchToReal() {
  if (this.user.email) {
      this.userService.switchToRealAccount(this.user.email).subscribe({
          next: (realUser) => {
              this.user = realUser;
          },
          error: (err) => {
              console.error('Error switching to real account', err);
          }
      });
  }
}
}

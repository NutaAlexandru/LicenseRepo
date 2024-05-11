import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-first-page',
  standalone: true,
  providers:[UserService,ToastrService],
  imports: [RouterModule,CommonModule],
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.css'
})
export class FirstPageComponent{
  user!:User
  constructor(userService:UserService){
    userService.userObservable.subscribe((newUser)=>{
      this.user = newUser;
      console.log(this.user);
  });
  }

 
}

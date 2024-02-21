import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CoreModule } from '../../../modules/core/core.module';

@Component({
  selector: 'app-header',
  standalone: true,
  providers: [UserService,ToastrService],
  imports: [CoreModule,CommonModule,RouterModule,HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user!:User;
  constructor(private userService:UserService) {

    userService.userObservable.subscribe((newUser)=>{
      this.user = newUser;
   });
 
}

logout(){
  this.userService.logout();
}

get isAuth(){
  return this.user.id;
}
}

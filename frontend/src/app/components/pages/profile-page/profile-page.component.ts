import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  providers:[UserService,ToastrService],
  imports: [CommonModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  user = this.userService.currentUser;
  
  constructor(private userService:UserService){

  }
  ngOnInit(): void {
  }
  
}

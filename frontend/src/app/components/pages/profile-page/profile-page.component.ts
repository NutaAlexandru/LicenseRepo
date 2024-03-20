import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  user:Observable<User>;
  constructor(private userService:UserService){

  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { InputContainerComponent } from '../../partials/input-container/input-container.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  providers:[UserService,ToastrService],
  imports: [CommonModule,RouterModule,HttpClientModule,FormsModule,InputContainerComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  user = this.userService.currentUser;
  editAddress: boolean = false;
  newAddress: string = '';
  constructor(private userService:UserService){

  }
  ngOnInit(): void {
  }
  
  toggleEditAddress(edit: boolean = true): void {
    this.editAddress = edit;
    if (!edit) this.newAddress = this.user.address;
  }

  updateAddress(): void {
    if (!this.newAddress) {
      alert("Please enter a new address.");
      return;
    }
    this.userService.updateUser(this.user.id, this.newAddress)
      .subscribe({
        next: (updatedUser) => {
          this.user.address = updatedUser.address;
          this.toggleEditAddress(false);
          
        },
        error: (err) => console.error('Error updating address:', err)
      });
  }
  
}

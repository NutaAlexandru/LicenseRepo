import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaypallButtonsComponent } from '../../partials/paypall-buttons/paypall-buttons.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../shared/models/User';
import { TransactionService } from '../../../services/transaction.service';
import { Transactions } from '../../../shared/models/Transaction';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-deposit-page',
  standalone: true,
  providers:[UserService,TransactionService,ToastrService],
  imports: [RouterModule,PaypallButtonsComponent,FormsModule,CommonModule],
  templateUrl: './deposit-page.component.html',
  styleUrl: './deposit-page.component.css'
})
export class DepositPageComponent {
  amount:number=0;
  user = this.userService.currentUser;
  showPaypalButton: boolean = false;
  transaction:Transactions=new Transactions();
  constructor(private userService:UserService,private transactionService: TransactionService){

  }
  deposit() {
    if (this.amount > 0) {
      this.showPaypalButton = true;
      this.transaction = {
        id:'',
        transactionId:'',
        user: this.user.id, 
        amount: this.amount,
        type: 'deposit',
        date:new Date()
      };
      
      console.log('Depositing:', this.amount);
      console.log(this.transaction);
    }
  }
}

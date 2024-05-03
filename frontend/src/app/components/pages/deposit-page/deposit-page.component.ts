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
import { randomInRange } from 'tsparticles-engine';
@Component({
  selector: 'app-deposit-page',
  standalone: true,
  providers:[UserService,TransactionService,ToastrService],
  imports: [RouterModule,PaypallButtonsComponent,FormsModule,CommonModule],
  templateUrl: './deposit-page.component.html',
  styleUrl: './deposit-page.component.css'
})
export class DepositPageComponent {
  depositAmount:number=0;
  withdrawAmount:number=0;
  activeForm: string = 'deposit';
  user = this.userService.currentUser;
  showPaypalButton: boolean = false;
  transaction:Transactions=new Transactions();
  constructor(private userService:UserService,private transactionService: TransactionService){

  }
  showForm(form: string) {
    this.activeForm = form;
    if (form === 'withdraw') {
      this.showPaypalButton = false;
    }
  }
  deposit() {
    if (this.depositAmount > 0) {
      this.showPaypalButton = true;
      this.transaction = {
        id:'',
        transactionId:'',
        user: this.user.id, 
        amount: this.depositAmount,
        type: 'deposit',
        date:new Date()
      };
      
      console.log('Depositing:', this.depositAmount);
      console.log(this.transaction);
    }
  }
  withdraw() {
    this.showPaypalButton = false;
    if (this.withdrawAmount > 0) {
      this.transaction = {
        id:'',
        transactionId:'',
        user: this.user.id, 
        amount: this.withdrawAmount,
        type: 'withdrawal',
        date:new Date()
      };
      this.transactionService.createTransaction(this.transaction).subscribe((response)=>{
        this.transactionService.updateBalance(this.transaction).subscribe((response)=>{
          this.userService.depositUpdateUserToLocalStorage(this.transaction.user).subscribe((response)=>{
            console.log('Withdrawing:', this.withdrawAmount);
            console.log(this.transaction);
          },
          (error:any)=>{
            console.log('Error updating local:', error.message);
          });
        },
        (error:any)=>{
          console.log('Error updating balance:', error.message);
        });
      },
      (error:any)=>{
        console.log('Error creating transaction:', error.message);
      });
      
    }
  }
}

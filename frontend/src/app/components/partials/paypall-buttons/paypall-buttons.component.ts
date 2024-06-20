import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Transactions } from '../../../shared/models/Transaction';
import { TransactionService } from '../../../services/transaction.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { CoreModule } from '../../../modules/core/core.module';
declare var paypal:any;
@Component({
  selector: 'app-paypall-buttons',
  standalone: true,
  imports: [],
  providers:[TransactionService,UserService,ToastrService],
  templateUrl: './paypall-buttons.component.html',
  styleUrl: './paypall-buttons.component.css'
})
export class PaypallButtonsComponent implements OnInit {
  @Input()
  transaction:Transactions;
  @ViewChild('paypal', {static: true})
  paypalElement!:ElementRef;

  user!:User;
  constructor(private transactionService:TransactionService,private userService:UserService,private router:Router,toastrService:ToastrService){
    userService.userObservable.subscribe((newUser)=>{
      this.user = newUser;

   });
  };

  ngOnInit():void{
    if (typeof paypal !== 'undefined') {
      this.initPayPalButton();
    } else {
      //console.error('PayPal SDK not loaded.');
    }

  };
  initPayPalButton() {
    const self = this;
    paypal
    .Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: self.transaction.amount,
              },
            },
          ],
        });
      },
      onApprove: async (data: any, actions: any) => {
        const payment = await actions.order.capture();
        self.transaction.transactionId = payment.id;
        console.log(self.transaction);
        self.transactionService.createTransaction(this.transaction).subscribe(
          {
            next: (transactionId) => {
              console.log('Transaction created successfully with ID:', transactionId);
              self.transactionService.updateBalance(this.transaction).subscribe({
                next: (response) => {
                  this.userService.depositUpdateUserToLocalStorage(this.user.id).subscribe({
                    next: (response) => {
                      console.log(response);
                    },
                    error: (errorResponse) => {
                      console.error('Failed to update:', errorResponse);
                    }
                  });
                  console.log(this.transaction.user);
                  console.log('Balance updated successfully');
                },
                error: (error: any) => {
                  console.error('Error updating balance:', error);
                }
              });
              
            },
            error: (error:any) => {
            }
          }
        );
      },
      onError: (err: any) => {
        console.log(err);
      },
    })
    .render(this.paypalElement.nativeElement);
  };
  }

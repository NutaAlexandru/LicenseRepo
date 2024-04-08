import { Component, Input } from '@angular/core';
import { User } from '../../../shared/models/User';
import { Transactions } from '../../../shared/models/Transaction';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  providers:[TransactionService],
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent {
  @Input() 
  user: User;

  transactions: Transactions[] = [];

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    if (this.user && this.user.id) {
      this.transactionService.getTransactions(this.user)
        .subscribe(transactions => {
          this.transactions = transactions;
        });
    }
  }
}

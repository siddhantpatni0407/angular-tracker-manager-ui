import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-bank-account.component.html',
  styleUrls: ['./view-bank-account.component.css'],
})
export class ViewBankAccountComponent implements OnInit {
  accounts: any[] = [];
  filteredAccounts: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  userId!: number;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));

    if (!this.userId) {
      this.errorMessage = '❌ User is not authenticated.';
      this.isLoading = false;
      return;
    }

    this.fetchBankAccounts();
  }

  fetchBankAccounts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http
      .get<any>(
        `${API_URLS.FETCH_BANK_ACCOUNT_BY_USER_ENDPOINT}?userId=${this.userId}`
      )
      .subscribe({
        next: (response) => {
          if (
            response.status === 'SUCCESS' &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            this.accounts = response.data;
            this.filteredAccounts = [...this.accounts];
          } else {
            this.accounts = [];
            this.filteredAccounts = [];
            this.errorMessage =
              response.message ||
              `🏦 No bank accounts found for the user with ID: ${this.userId}`;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching bank accounts:', error);
          this.errorMessage =
            '❌ Failed to fetch bank account data. Please try again later.';
          this.isLoading = false;
        },
      });
  }

  deleteAccount(accountId: number) {
    if (!confirm('🗑️ Are you sure you want to delete this bank account?')) {
      return;
    }

    this.http
      .delete(`${API_URLS.BANK_ACCOUNT_ENDPOINT}?accountId=${accountId}`)
      .subscribe({
        next: (response: any) => {
          if (response.status === 'SUCCESS') {
            alert('✅ Bank account deleted successfully!');
            this.fetchBankAccounts();
          } else {
            alert('⚠️ Bank account deletion failed.');
          }
        },
        error: (error) => {
          console.error('Error deleting bank account:', error);
          alert(
            error.status === 404
              ? '⚠️ Bank account not found.'
              : '❌ Failed to delete the bank account. Please try again.'
          );
        },
      });
  }

  editAccount(account: any) {
    localStorage.setItem('accountToEdit', JSON.stringify(account));
    this.router.navigate(['/update-bank-account']);
  }

  addNewAccount() {
    this.router.navigate(['/add-bank-account']);
  }

  filterAccounts() {
    const searchLower = this.searchTerm.toLowerCase().trim();

    if (!searchLower) {
      this.filteredAccounts = [...this.accounts];
      return;
    }

    this.filteredAccounts = this.accounts.filter(
      (account) =>
        (account.bankName?.toLowerCase() ?? '').includes(searchLower) ||
        (account.accountNumber?.toLowerCase() ?? '').includes(searchLower) ||
        (account.accountHolderName?.toLowerCase() ?? '').includes(
          searchLower
        ) ||
        (account.ifscCode?.toLowerCase() ?? '').includes(searchLower)
    );
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

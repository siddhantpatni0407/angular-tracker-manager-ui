import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

@Component({
  selector: 'app-add-bank-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.css'],
})
export class AddBankAccountComponent {
  bankAccountData: any = {
    accountNumber: '',
    accountHolderName: '',
    accountType: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    branchLocation: '',
    openingDate: '',
    nomineeName: '',
    accountStatus: 'ACTIVE',
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  submitted = false;
  accountNumberError = false;
  ifscCodeError = false;

  constructor(private http: HttpClient, private router: Router) {}

  addBankAccount() {
    this.submitted = true;

    // Validate inputs
    this.validateAccountNumber();
    this.validateIfscCode();

    // Check mandatory fields
    if (
      !this.bankAccountData.accountNumber ||
      !this.bankAccountData.accountHolderName ||
      !this.bankAccountData.accountType ||
      !this.bankAccountData.bankName ||
      !this.bankAccountData.ifscCode ||
      !this.bankAccountData.openingDate ||
      !this.bankAccountData.accountStatus ||
      this.accountNumberError ||
      this.ifscCodeError
    ) {
      this.errorMessage = '⚠️ Please fill in all required fields correctly.';
      return;
    }

    // Retrieve userId from session storage
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      this.errorMessage = '❌ User ID not found. Please log in again.';
      return;
    }

    // Add userId to bankAccountData before sending
    this.bankAccountData.userId = parseInt(userId, 10);

    // Start loading state
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Send registration request to API
    this.http
      .post(API_URLS.BANK_ACCOUNT_ENDPOINT, this.bankAccountData)
      .subscribe({
        next: (response: any) => {
          if (response.status === 'SUCCESS') {
            this.successMessage = 'Bank account added successfully!';
            this.resetForm();
            this.submitted = false;
          } else {
            this.errorMessage =
              response.message || '⚠️ Failed to add the bank account.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding bank account:', error);
          this.errorMessage =
            error.error?.message ||
            '❌ Failed to add the bank account. Please try again.';
          this.isLoading = false;
        },
      });
  }

  validateAccountNumber(): boolean {
    const pattern = /^\d{10,16}$/;
    this.accountNumberError = !pattern.test(this.bankAccountData.accountNumber);
    return !this.accountNumberError;
  }

  validateIfscCode(): boolean {
    const pattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    this.ifscCodeError = !pattern.test(this.bankAccountData.ifscCode);
    return !this.ifscCodeError;
  }

  resetForm() {
    this.bankAccountData = {
      accountNumber: '',
      accountHolderName: '',
      accountType: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
      branchLocation: '',
      openingDate: '',
      nomineeName: '',
      accountStatus: 'ACTIVE',
    };
  }

  goToFinancialTracker() {
    this.router.navigate(['/financial-tracker']);
  }
}

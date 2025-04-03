import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../../constants/api.constants';

@Component({
  selector: 'app-add-bank-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css'],
})
export class AddCardComponent {
  bankCardData: any = {
    bankAccountId: null,
    cardType: '',
    cardNetwork: '',
    cardHolderName: '',
    cardNumber: '',
    cvv: '',
    validFromDate: '',
    validThruDate: '',
    cardPin: '',
    creditLimit: null,
    availableCredit: null,
    billingCycleDay: null,
    cardStatus: 'ACTIVE',
    isContactless: true,
    isVirtual: false,
    remarks: '',
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  submitted = false;
  cardNumberError = false;
  cvvError = false;
  cardPinError = false;

  constructor(private http: HttpClient, private router: Router) {}

  addBankCard() {
    this.submitted = true;

    // Validate inputs
    this.validateCardNumber();
    this.validateCvv();
    this.validateCardPin();

    // Check mandatory fields
    if (
      !this.bankCardData.bankAccountId ||
      !this.bankCardData.cardType ||
      !this.bankCardData.cardNetwork ||
      !this.bankCardData.cardHolderName ||
      !this.bankCardData.cardNumber ||
      !this.bankCardData.cvv ||
      !this.bankCardData.validFromDate ||
      !this.bankCardData.validThruDate ||
      !this.bankCardData.cardPin ||
      !this.bankCardData.billingCycleDay ||
      !this.bankCardData.cardStatus ||
      this.cardNumberError ||
      this.cvvError ||
      this.cardPinError ||
      (this.bankCardData.cardType === 'CREDIT' &&
        !this.bankCardData.creditLimit)
    ) {
      this.errorMessage = '⚠️ Please fill in all required fields correctly.';
      return;
    }

    // Set available credit equal to credit limit for new credit cards
    if (
      this.bankCardData.cardType === 'CREDIT' &&
      this.bankCardData.creditLimit
    ) {
      this.bankCardData.availableCredit = this.bankCardData.creditLimit;
    }

    // Start loading state
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Format dates to YYYY-MM-DD
    const formattedData = {
      ...this.bankCardData,
      validFromDate: this.formatDate(this.bankCardData.validFromDate),
      validThruDate: this.formatDate(this.bankCardData.validThruDate),
    };

    // Send registration request to API
    this.http.post(API_URLS.BANK_CARD_ENDPOINT, formattedData).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          this.successMessage = 'Bank card added successfully!';
          this.resetForm();
          this.submitted = false;
        } else {
          this.errorMessage =
            response.message || '⚠️ Failed to add the bank card.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding bank card:', error);
        this.errorMessage =
          error.error?.message ||
          '❌ Failed to add the bank card. Please try again.';
        this.isLoading = false;
      },
    });
  }

  validateCardNumber(): boolean {
    const pattern = /^\d{13,19}$/;
    this.cardNumberError = !pattern.test(this.bankCardData.cardNumber);
    return !this.cardNumberError;
  }

  validateCvv(): boolean {
    const pattern = /^\d{3,4}$/;
    this.cvvError = !pattern.test(this.bankCardData.cvv);
    return !this.cvvError;
  }

  validateCardPin(): boolean {
    const pattern = /^\d{4}$/;
    this.cardPinError = !pattern.test(this.bankCardData.cardPin);
    return !this.cardPinError;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  resetForm() {
    this.bankCardData = {
      bankAccountId: null,
      cardType: '',
      cardNetwork: '',
      cardHolderName: '',
      cardNumber: '',
      cvv: '',
      validFromDate: '',
      validThruDate: '',
      cardPin: '',
      creditLimit: null,
      availableCredit: null,
      billingCycleDay: null,
      cardStatus: 'ACTIVE',
      isContactless: true,
      isVirtual: false,
      remarks: '',
    };
  }

  goToManageCards() {
    this.router.navigate(['/manage-cards']);
  }
}

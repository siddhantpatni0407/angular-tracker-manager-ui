import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial-tracker',
  templateUrl: './financial-tracker.component.html',
  styleUrls: ['./financial-tracker.component.css']
})
export class FinancialTrackerComponent {
  constructor(private router: Router) {}

  // Navigation Methods
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Bank Account Management
  addBankAccount() {
    this.router.navigate(['/add-bank-account']);
  }

  viewBankAccounts() {
    this.router.navigate(['/bank-accounts']);
  }

  // Expense Tracking
  viewExpenses() {
    this.router.navigate(['/expense-tracker']);
  }

  // Income Tracking
  viewIncome() {
    this.router.navigate(['/income-tracker']);
  }

  // Budget Planning
  viewBudget() {
    this.router.navigate(['/budget-planner']);
  }

  // Investment Tracking
  viewInvestments() {
    this.router.navigate(['/investment-tracker']);
  }

  // Debt Management
  viewDebts() {
    this.router.navigate(['/debt-manager']);
  }

  // Reports & Analytics
  viewReports() {
    this.router.navigate(['/financial-reports']);
  }
}
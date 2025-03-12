import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fuel-expense-dashboard',
  templateUrl: './fuel-expense.component.html',
  styleUrls: ['./fuel-expense.component.css']
})
export class FuelExpenseComponent {
  constructor(private router: Router) {}

  navigateToAddExpense() {
    this.router.navigate(['/add-fuel-expense']);
  }

  navigateToViewExpenses() {
    this.router.navigate(['/view-fuel-expense']);
  }

  goBackToVehicleTracker(): void {
    this.router.navigate(['/vehicle-tracker']);
  }

}
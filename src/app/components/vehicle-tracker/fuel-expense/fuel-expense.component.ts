import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fuel-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fuel-expense.component.html',
  styleUrls: ['./fuel-expense.component.css']
})
export class FuelExpenseComponent implements OnInit {
  expenses: any[] = [];
  newExpense = { date: '', quantity: 0, rate: 0, amount: 0, odometerReading: 0, location: '', paymentMode: '', vehicleId: 1 };
  vehicleId = 1;
  private baseUrl = 'http://localhost:8080/api/expenses'; // API URL for expenses

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.getExpenses(this.vehicleId).subscribe(data => this.expenses = data);
  }

  addExpense() {
    this.newExpense.amount = this.newExpense.quantity * this.newExpense.rate;
    this.createExpense(this.newExpense).subscribe(() => {
      this.loadExpenses();
      this.newExpense = { date: '', quantity: 0, rate: 0, amount: 0, odometerReading: 0, location: '', paymentMode: '', vehicleId: this.vehicleId };
    });
  }

  deleteExpense(id: number) {
    this.removeExpense(id).subscribe(() => this.loadExpenses());
  }

  // API Calls handled within the component itself
  getExpenses(vehicleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vehicle/${vehicleId}`);
  }

  createExpense(expense: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, expense);
  }

  removeExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

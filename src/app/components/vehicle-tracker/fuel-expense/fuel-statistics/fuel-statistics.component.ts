import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { API_URLS } from '../../../../constants/api.constants';

@Component({
  selector: 'app-fuel-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fuel-statistics.component.html',
  styleUrls: ['./fuel-statistics.component.css'],
})
export class FuelStatisticsComponent implements OnInit {
  vehicles: any[] = [];
  fuelExpenses: any[] = [];
  selectedVehicleId: string = '';
  selectedRegistrationNumber: string = '';

  totalAmount: number = 0;
  totalQuantity: number = 0;
  averageRate: number = 0;

  userId!: number; // Non-null assertion operator

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch userId from session storage (assuming it is stored there after login)
    this.userId = Number(sessionStorage.getItem('userId')); // Adjust this based on how the userId is stored
    this.loadVehicles();
  }

  loadVehicles(): void {
    const url = `${API_URLS.FETCH_VEHICLES_BY_USER_ENDPOINT}?userId=${this.userId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('🚗 Vehicles API Response:', response);
        this.vehicles = response.data || response;
        this.cdr.detectChanges(); // ✅ Force UI update
      },
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  updateSelectedVehicle(): void {
    const selectedVehicle = this.vehicles.find(
      (v) => v.vehicleId == this.selectedVehicleId
    );
    this.selectedRegistrationNumber = selectedVehicle
      ? selectedVehicle.registrationNumber
      : '';

    console.log(
      '✅ Selected Vehicle:',
      this.selectedVehicleId,
      this.selectedRegistrationNumber
    );

    this.fetchFuelExpenses();
  }

  fetchFuelExpenses(): void {
    if (!this.selectedVehicleId || !this.selectedRegistrationNumber) {
      this.fuelExpenses = [];
      this.updateFuelStats();
      return;
    }

    const url = `${API_URLS.VEHICLE_FUEL_EXPENSE_ENDPOINT}?vehicleId=${this.selectedVehicleId}&registrationNumber=${this.selectedRegistrationNumber}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('⛽ Fuel Expenses API Response:', response);
        this.fuelExpenses = response.status === 'SUCCESS' ? response.data : [];
        this.updateFuelStats();
      },
      error: (err) => {
        console.error('❌ Error fetching fuel expenses:', err);
        this.fuelExpenses = [];
        this.updateFuelStats();
      },
    });
  }

  updateFuelStats(): void {
    this.totalAmount = this.fuelExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    this.totalQuantity = this.fuelExpenses.reduce(
      (sum, expense) => sum + expense.quantity,
      0
    );

    // ✅ Average Rate Calculation (Total Amount / Total Quantity)
    this.averageRate =
      this.totalQuantity > 0 ? this.totalAmount / this.totalQuantity : 0;

    console.log('📊 Updated Fuel Statistics:', {
      totalAmount: this.totalAmount,
      totalQuantity: this.totalQuantity,
      averageRate: this.averageRate,
    });

    this.cdr.detectChanges();
  }

  goBack(): void {
    this.router.navigate(['/fuel-expense']);
  }
}

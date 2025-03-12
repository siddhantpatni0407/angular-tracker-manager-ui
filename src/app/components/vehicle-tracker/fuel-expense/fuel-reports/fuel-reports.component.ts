import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../../constants/api.constants';

@Component({
  selector: 'app-fuel-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fuel-reports.component.html',
  styleUrls: ['./fuel-reports.component.css'],
})
export class FuelReportsComponent implements OnInit {
  vehicles: any[] = [];
  allFuelExpenses: any[] = [];
  filteredExpenses: any[] = [];

  selectedVehicleId: string = '';
  startDate: string = '';
  endDate: string = '';
  paymentMode: string = '';
  location: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadFuelExpenses();
  }

  loadVehicles(): void {
    this.http.get<any>(API_URLS.FETCH_ALL_VEHICLE_ENDPOINT).subscribe({
      next: (response) => {
        this.vehicles = response.data || response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  loadFuelExpenses(): void {
    this.http.get<any>(API_URLS.VEHICLE_FUEL_EXPENSE_ENDPOINT).subscribe({
      next: (response) => {
        this.allFuelExpenses = response.data || [];
        this.filteredExpenses = [...this.allFuelExpenses]; // Initial unfiltered data
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error fetching fuel expenses:', err),
    });
  }

  filterFuelReports(): void {
    this.filteredExpenses = this.allFuelExpenses.filter((expense) => {
      const matchesVehicle =
        !this.selectedVehicleId || expense.vehicleId === this.selectedVehicleId;
      const matchesPaymentMode =
        !this.paymentMode || expense.paymentMode === this.paymentMode;
      const matchesLocation =
        !this.location || expense.location.toLowerCase().includes(this.location.toLowerCase());

      // Convert date strings to Date objects for comparison
      const expenseDate = new Date(expense.date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      const matchesDateRange =
        (!start || expenseDate >= start) && (!end || expenseDate <= end);

      return matchesVehicle && matchesDateRange && matchesPaymentMode && matchesLocation;
    });

    this.cdr.detectChanges();
  }

  exportAsPDF(): void {
    console.log('📄 Exporting as PDF...');
  }

  exportAsExcel(): void {
    console.log('📊 Exporting as Excel...');
  }

  goBack(): void {
    this.router.navigate(['/fuel-expense']);
  }
}

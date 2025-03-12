import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../../../../services/vehicle.service';
import { API_URLS } from '../../../../constants/api.constants';

@Component({
  selector: 'app-view-fuel-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-fuel-expense.component.html',
  styleUrls: ['./view-fuel-expense.component.css'],
})
export class ViewFuelExpenseComponent implements OnInit {
  vehicles: any[] = [];
  fuelExpenses: any[] = [];
  filteredExpenses: any[] = [];
  selectedVehicleId: string = '';
  selectedRegistrationNumber: string = '';

  constructor(
    private vehicleService: VehicleService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  // Load vehicles from the backend
  private loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        console.log('✅ Vehicles loaded:', vehicles);
      },
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  // Fetch fuel expenses for the selected vehicle
  fetchFuelExpenses(): void {
    if (!this.selectedVehicleId || !this.selectedRegistrationNumber) {
      this.filteredExpenses = []; // Ensure table is empty if no vehicle selected
      return;
    }
  
    const url = `${API_URLS.VEHICLE_FUEL_EXPENSE_ENDPOINT}?vehicleId=${this.selectedVehicleId}&registrationNumber=${this.selectedRegistrationNumber}`;
  
    console.log('🚀 Fetching Fuel Expenses from:', url);
  
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.filteredExpenses = response.status === 'SUCCESS' ? response.data : [];
        console.log('✅ Fuel Expenses:', this.filteredExpenses);
      },
      error: () => {
        this.filteredExpenses = []; // ✅ Keep table empty if request fails
      },
    });
  }    

  // Update selected vehicle details and fetch expenses
  onVehicleChange(): void {
    const selectedVehicle = this.vehicles.find(v => v.vehicleId == this.selectedVehicleId);
    this.selectedRegistrationNumber = selectedVehicle?.registrationNumber || '';
    this.fetchFuelExpenses();
  }

  // Navigate back to Fuel Expense Dashboard
  goBack() {
    this.router.navigate(['/fuel-expense']);
  }
}

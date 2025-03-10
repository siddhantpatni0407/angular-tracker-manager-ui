import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VehicleService } from '../../../../services/vehicle.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private vehicleService: VehicleService, // Injecting VehicleService
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadFuelExpenses();
  }

  // Load vehicle list (same as Add Fuel Expense)
  private loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        console.log('✅ Vehicles loaded:', vehicles); // Debugging log
      },
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  // Fetch fuel expenses
  private loadFuelExpenses() {
    this.http.get<any[]>('/api/fuel-expenses').subscribe({
      next: (expenses) => {
        this.fuelExpenses = expenses;
        this.filteredExpenses = expenses;
        console.log('✅ Fuel Expenses loaded:', expenses); // Debugging log
      },
      error: (err) => console.error('❌ Error loading fuel expenses:', err),
    });
  }

  // Filter fuel expenses based on selected vehicle
  filterExpenses(): void {
    console.log('🚗 Selected Vehicle:', this.selectedVehicleId); // Debugging log
    this.filteredExpenses = this.selectedVehicleId
      ? this.fuelExpenses.filter((expense) => expense.vehicleId === this.selectedVehicleId)
      : this.fuelExpenses;
  }

  // Get vehicle details from vehicleId
  getVehicleDetails(vehicleId: string): string {
    const vehicle = this.vehicles.find((v) => v.vehicleId === vehicleId);
    return vehicle ? `${vehicle.registrationNumber} - ${vehicle.vehicleModel}` : 'Unknown Vehicle';
  }

  // Navigate back to Fuel Expense Dashboard
  goBack() {
    this.router.navigate(['/fuel-expense']);
  }
}

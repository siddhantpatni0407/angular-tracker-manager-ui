import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

@Component({
  selector: 'app-fetch-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fetch-vehicle.component.html',
  styleUrls: ['./fetch-vehicle.component.css'],
})
export class FetchVehicleComponent implements OnInit {
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  userId!: number; // Non-null assertion operator

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Fetch userId from session storage (assuming it is stored there after login)
    this.userId = Number(sessionStorage.getItem('userId')); // Adjust this based on how the userId is stored

    console.log('User ID from session:', this.userId); // Debugging line

    if (!this.userId) {
      // Handle case if userId is not found in session storage (e.g., redirect to login)
      this.errorMessage = '❌ User is not authenticated.';
      return;
    }

    this.fetchVehicles();
  }

  fetchVehicles() {
    this.isLoading = true;
    this.errorMessage = '';

    // Modify URL to include the userId as query parameter
    this.http
      .get<any>(
        `${API_URLS.FETCH_VEHICLES_BY_USER_ENDPOINT}?userId=${this.userId}`
      )
      .subscribe({
        next: (response) => {
          if (
            response.status === 'SUCCESS' &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            this.vehicles = response.data;
            this.filteredVehicles = [...this.vehicles]; // Ensure a separate copy
          } else {
            this.vehicles = [];
            this.filteredVehicles = [];
            this.errorMessage = `🚘 No vehicles found for the user with ID: ${this.userId}`;
          }
          console.log('Fetched Vehicles:', this.vehicles); // Debugging Log
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching vehicles:', error);
          this.errorMessage =
            '❌ Failed to fetch vehicle data. Please try again later.';
          this.isLoading = false;
        },
      });
  }

  deleteVehicle(vehicleId: number) {
    if (!confirm('🗑️ Are you sure you want to delete this vehicle?')) {
      return;
    }

    this.http
      .delete(`${API_URLS.DELETE_VEHICLE_ENDPOINT}?vehicleId=${vehicleId}`)
      .subscribe({
        next: (response: any) => {
          if (response.status === 'SUCCESS') {
            alert('✅ Vehicle deleted successfully!');
            this.fetchVehicles();
          } else {
            alert('⚠️ Vehicle deletion failed.');
          }
        },
        error: (error) => {
          console.error('Error deleting vehicle:', error);
          alert(
            error.status === 404
              ? '⚠️ Vehicle not found.'
              : '❌ Failed to delete the vehicle. Please try again.'
          );
        },
      });
  }

  updateVehicle(vehicle: any) {
    localStorage.setItem('vehicleToEdit', JSON.stringify(vehicle));
    this.router.navigate(['/update-vehicle']); // ✅ Corrected navigation
  }

  filterVehicles() {
    const searchLower = this.searchTerm.toLowerCase().trim();

    if (!searchLower) {
      this.filteredVehicles = [...this.vehicles]; // Reset to full list if empty
      return;
    }

    this.filteredVehicles = this.vehicles.filter(
      (vehicle) =>
        (vehicle.vehicleModel?.toLowerCase() ?? '').includes(searchLower) ||
        (vehicle.registrationNumber?.toLowerCase() ?? '').includes(
          searchLower
        ) ||
        (vehicle.vehicleCompany?.toLowerCase() ?? '').includes(searchLower)
    );

    console.log(
      'Search Term:',
      this.searchTerm,
      'Filtered Vehicles:',
      this.filteredVehicles
    ); // Debugging Log
  }

  goToVehicleTracker() {
    this.router.navigate(['/vehicle-tracker']);
  }

  isValid(validityDate: string): boolean {
    return new Date(validityDate) > new Date();
  }
}

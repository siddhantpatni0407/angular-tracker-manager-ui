import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<any>(API_URLS.FETCH_ALL_VEHICLE_ENDPOINT).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data.length > 0) {
          this.vehicles = response.data;
          this.filteredVehicles = this.vehicles;
        } else {
          this.vehicles = [];
          this.filteredVehicles = [];
          this.errorMessage = '🚘 No vehicles registered in the system.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vehicles:', error);
        this.errorMessage = '❌ Failed to fetch vehicle data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  deleteVehicle(vehicleId: number) {
    if (!confirm('🗑️ Are you sure you want to delete this vehicle?')) {
      return;
    }

    this.http.delete(`${API_URLS.DELETE_VEHICLE_ENDPOINT}?vehicleId=${vehicleId}`).subscribe({
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
        alert(error.status === 404 ? '⚠️ Vehicle not found.' : '❌ Failed to delete the vehicle. Please try again.');
      },
    });
  }

  updateVehicle(vehicle: any) {
    localStorage.setItem('vehicleToEdit', JSON.stringify(vehicle));
    window.location.href = '/update-vehicle';
  }

  filterVehicles() {
    this.filteredVehicles = this.vehicles.filter(vehicle =>
      vehicle.vehicleModel.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.vehicleCompany.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goToDashboard() {
    window.history.back();
  }

  isValid(validityDate: string): boolean {
    return new Date(validityDate) > new Date();
  }
}
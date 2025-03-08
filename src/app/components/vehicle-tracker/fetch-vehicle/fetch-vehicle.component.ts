import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

@Component({
  selector: 'app-fetch-vehicle',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fetch-vehicle.component.html',
  styleUrls: ['./fetch-vehicle.component.css'],
})
export class FetchVehicleComponent implements OnInit {
  vehicles: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.isLoading = true;
    this.http.get<any>(API_URLS.FETCH_ALL_VEHICLE_ENDPOINT).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data.length > 0) {
          this.vehicles = response.data;
          this.errorMessage = '';
        } else {
          this.vehicles = [];
          this.errorMessage = 'No vehicles registered in the system.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vehicles:', error);
        this.errorMessage = 'Failed to fetch vehicle data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  deleteVehicle(vehicleId: number) {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    this.http.delete(`${API_URLS.DELETE_VEHICLE_ENDPOINT}?vehicleId=${vehicleId}`).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          alert('✅ Vehicle deleted successfully!');
          this.fetchVehicles(); // Refresh the vehicle list
        } else {
          alert('⚠️ Vehicle deletion failed.');
        }
      },
      error: (error) => {
        console.error('Error deleting vehicle:', error);
        if (error.status === 404) {
          alert('⚠️ Vehicle not found.');
        } else {
          alert('❌ Failed to delete the vehicle. Please try again.');
        }
      },
    });
  }

  goToDashboard() {
    window.history.back(); // Navigate back to the previous page
  }
}

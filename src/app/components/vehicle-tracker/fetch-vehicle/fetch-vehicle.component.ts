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
    this.http.get<any>(API_URLS.FETCH_ALL_VEHICLE_ENDPOINT).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data.length > 0) {
          this.vehicles = response.data;
        } else {
          this.errorMessage = 'No vehicles registered in the system.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vehicles:', error);
        this.errorMessage =
          'Failed to fetch vehicle data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  goToDashboard() {
    window.history.back(); // Navigate back to previous page
  }
}

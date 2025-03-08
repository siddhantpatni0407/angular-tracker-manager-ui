import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

@Component({
  selector: 'app-register-vehicle',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-vehicle.component.html',
  styleUrls: ['./register-vehicle.component.css'],
})
export class RegisterVehicleComponent {
  vehicleData: any = {
    vehicleType: '',
    vehicleCompany: '',
    vehicleModel: '',
    chassisNumber: '',
    engineNumber: '',
    registrationNumber: '',
    registrationDate: '',
    registrationValidityDate: '',
    ownerName: '',
  };
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  registerVehicle() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(API_URLS.VEHICLE_REGISTRATION_ENDPOINT, this.vehicleData).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          this.successMessage = '🎉 Vehicle registered successfully!';
          this.resetForm();
        } else {
          this.errorMessage = '⚠️ Failed to register the vehicle.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error registering vehicle:', error);
        this.errorMessage = '❌ Failed to register the vehicle. Please try again.';
        this.isLoading = false;
      },
    });
  }

  resetForm() {
    this.vehicleData = {
      vehicleType: '',
      vehicleCompany: '',
      vehicleModel: '',
      chassisNumber: '',
      engineNumber: '',
      registrationNumber: '',
      registrationDate: '',
      registrationValidityDate: '',
      ownerName: '',
    };
  }

  navigateToVehicleTracker() {
    window.history.back();
  }
}

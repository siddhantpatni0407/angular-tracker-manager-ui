import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import Router
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

@Component({
  selector: 'app-register-vehicle',
  standalone: true, // Add standalone: true for Angular 17+
  imports: [CommonModule, FormsModule, RouterModule], // Add RouterModule
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
  submitted = false;
  registrationError = false;

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  registerVehicle() {
    this.submitted = true;
    this.registrationError = !this.validateRegistrationNumber();

    // Check mandatory fields
    if (
      !this.vehicleData.vehicleType ||
      !this.vehicleData.vehicleCompany ||
      !this.vehicleData.vehicleModel ||
      !this.vehicleData.chassisNumber ||
      !this.vehicleData.engineNumber ||
      !this.vehicleData.registrationNumber ||
      !this.vehicleData.registrationDate ||
      !this.vehicleData.registrationValidityDate ||
      !this.vehicleData.ownerName ||
      this.registrationError
    ) {
      this.errorMessage = '⚠️ Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(API_URLS.VEHICLE_REGISTRATION_ENDPOINT, this.vehicleData).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          this.successMessage = 'Vehicle registered successfully!';
          this.resetForm();
          this.submitted = false;
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

  validateRegistrationNumber(): boolean {
    const pattern = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
    this.registrationError = !pattern.test(this.vehicleData.registrationNumber);
    return !this.registrationError;
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

  navigateToDashboard() {
    this.router.navigate(['/dashboard']); // Use Router for navigation
  }
}
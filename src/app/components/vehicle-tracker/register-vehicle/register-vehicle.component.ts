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
  styleUrls: ['./register-vehicle.component.css']
})
export class RegisterVehicleComponent {
  vehicleData: any = {
    vehicleId: null,  // Ensure vehicleId is explicitly set
    vehicleType: '',
    vehicleCompany: '',
    vehicleModel: '',
    chassisNumber: '',
    engineNumber: '',
    registrationNumber: '',
    registrationDate: '',
    registrationValidityDate: '',
    ownerName: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  registerVehicle() {
    console.log('🚀 Sending request:', this.vehicleData); // Debugging log

    this.http.post(API_URLS.VEHICLE_REGISTRATION_ENDPOINT, this.vehicleData)
      .subscribe({
        next: (response) => {
          alert('✅ Vehicle registered successfully!');
          this.router.navigate(['/vehicle-tracker']);
        },
        error: (error) => {
          console.error('❌ Error:', error);
          if (error.status === 409) {
            alert('⚠️ Vehicle already registered with the given details.');
          } else {
            alert('❌ Registration failed. Please try again.');
          }
        }
      });
  }

  navigateToVehicleTracker() {
    this.router.navigate(['/vehicle-tracker']);
  }
}

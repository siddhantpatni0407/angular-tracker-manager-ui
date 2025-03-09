import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

interface Vehicle {
  vehicleId: number;
  vehicleType: string;
  vehicleCompany: string;
  vehicleModel: string;
  chassisNumber: string;
  engineNumber: string;
  registrationNumber: string;
  registrationDate: string;
  registrationValidityDate: string;
  ownerName: string;
}

@Component({
  selector: 'app-update-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.css'],
})
export class UpdateVehicleComponent implements OnInit {
  vehicleForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadVehicleData();
  }

  // Initialize the form with validation
  initForm() {
    this.vehicleForm = this.fb.group({
      vehicleId: [{ value: '', disabled: true }], // Disabled ID field
      vehicleType: ['', Validators.required],
      vehicleCompany: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      chassisNumber: ['', Validators.required],
      engineNumber: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      registrationDate: ['', Validators.required],
      registrationValidityDate: ['', Validators.required],
      ownerName: ['', Validators.required],
    });
  }

  // Load vehicle data from localStorage
  loadVehicleData() {
    const vehicleData = localStorage.getItem('vehicleToEdit'); // ✅ Ensure correct key is used

    if (vehicleData) {
      try {
        const vehicle: Vehicle = JSON.parse(vehicleData);
        console.log('🚀 Loaded Vehicle Data:', vehicle);

        if (!vehicle.vehicleId) {
          throw new Error('Invalid vehicle data: Missing vehicleId');
        }

        this.vehicleForm.patchValue(vehicle); // ✅ Auto-populate form
      } catch (error) {
        console.error('⚠️ Error parsing vehicle data:', error);
        this.errorMessage = '⚠️ Invalid vehicle data found!';
      }
    } else {
      this.errorMessage = '⚠️ No vehicle data found!';
    }
  }

  // Submit updated vehicle data to backend
  updateVehicle() {
    if (this.vehicleForm.invalid) {
      alert('⚠️ Please fill all required fields!');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // ✅ Fetch updated values from the form
    const updatedVehicle: Vehicle = {
      vehicleId: this.vehicleForm.get('vehicleId')!.value, // ✅ Ensure the vehicleId is included
      vehicleType: this.vehicleForm.get('vehicleType')!.value,
      vehicleCompany: this.vehicleForm.get('vehicleCompany')!.value,
      vehicleModel: this.vehicleForm.get('vehicleModel')!.value,
      chassisNumber: this.vehicleForm.get('chassisNumber')!.value,
      engineNumber: this.vehicleForm.get('engineNumber')!.value,
      registrationNumber: this.vehicleForm.get('registrationNumber')!.value,
      registrationDate: this.vehicleForm.get('registrationDate')!.value,
      registrationValidityDate: this.vehicleForm.get('registrationValidityDate')!.value,
      ownerName: this.vehicleForm.get('ownerName')!.value,
    };

    console.log('🚀 Submitting Updated Vehicle Data:', updatedVehicle); // ✅ Debug log for submission

    this.http.put(`${API_URLS.UPDATE_VEHICLE_ENDPOINT}`, updatedVehicle).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          alert('✅ Vehicle updated successfully!');
          localStorage.removeItem('vehicleToEdit'); // ✅ Clear stored vehicle data
          this.router.navigate(['/fetch-vehicle']); // ✅ Redirect to Fetch Vehicles Page
        } else {
          this.errorMessage = '⚠️ Vehicle update failed.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating vehicle:', error);
        this.errorMessage = error.status === 404 ? '⚠️ Vehicle not found.' : '❌ Failed to update vehicle. Please try again.';
        this.isLoading = false;
      },
    });
  }

  // Cancel Update and navigate back
  cancelUpdate() {
    this.router.navigate(['/fetch-vehicle']);
  }
}

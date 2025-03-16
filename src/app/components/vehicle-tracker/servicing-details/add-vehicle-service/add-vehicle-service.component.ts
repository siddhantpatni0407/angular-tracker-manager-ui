import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../../../../services/vehicle.service';
import { API_URLS } from '../../../../constants/api.constants';

@Component({
  selector: 'app-add-vehicle-servicing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-vehicle-service.component.html',
  styleUrls: ['./add-vehicle-service.component.css'],
})
export class AddVehicleServiceComponent implements OnInit {
  servicingForm!: FormGroup;
  vehicles: any[] = [];
  userId!: number; // Non-null assertion operator

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Fetch userId from session storage (assuming it is stored there after login)
    this.userId = Number(sessionStorage.getItem('userId')); // Adjust this based on how the userId is stored
    this.loadVehicles();
    this.initForm();
  }

  // Load vehicle list associated with the current user
  private loadVehicles(): void {
    const url = `${API_URLS.FETCH_VEHICLES_BY_USER_ENDPOINT}?userId=${this.userId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.vehicles = response.data || response;
      },
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  // Initialize Form with validation
  private initForm() {
    this.servicingForm = this.fb.group({
      vehicleId: ['', Validators.required],
      serviceDate: ['', Validators.required],
      odometerReading: ['', Validators.required],
      serviceType: ['', Validators.required],
      serviceCenter: ['', Validators.required],
      serviceManager: ['', Validators.required],
      location: ['', Validators.required],
      nextServiceDue: ['', Validators.required],
      serviceCost: ['', [Validators.required, Validators.min(0)]],
      remarks: ['', Validators.required],
    });
  }

  // Navigate back to Vehicle Servicing Dashboard
  goBack() {
    this.router.navigate(['/servicing-details']);
  }

  // Submit Vehicle Servicing to Backend API
  submitServicing() {
    if (this.servicingForm.invalid) {
      alert('⚠️ Please fill all required fields correctly.');
      return;
    }

    const formData = this.servicingForm.getRawValue();
    const selectedVehicle = this.vehicles.find(
      (v) => v.vehicleId === formData.vehicleId
    );

    const requestPayload = {
      vehicleId: formData.vehicleId,
      serviceDate: formData.serviceDate,
      odometerReading: formData.odometerReading,
      serviceType: formData.serviceType,
      serviceCenter: formData.serviceCenter,
      serviceManager: formData.serviceManager,
      location: formData.location,
      nextServiceDue: formData.nextServiceDue,
      serviceCost: formData.serviceCost,
      remarks: formData.remarks,
    };

    console.log('🚀 Sending Vehicle Servicing Data:', requestPayload);

    // Call the backend API
    this.http
      .post(`${API_URLS.VEHICLE_SERVICING_ENDPOINT}`, requestPayload)
      .subscribe({
        next: (response: any) => {
          console.log('✅ Vehicle servicing added successfully:', response);
          alert('✅ Vehicle servicing recorded successfully!');
          this.servicingForm.reset();
          this.router.navigate(['/servicing-details']);
        },
        error: (error) => {
          console.error('❌ Error adding vehicle servicing:', error);
          alert(
            `❌ Failed to record vehicle servicing: ${
              error.error?.message || 'Something went wrong'
            }`
          );
        },
      });
  }
}

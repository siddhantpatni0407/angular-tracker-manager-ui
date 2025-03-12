import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../../../../services/vehicle.service';
import { API_URLS } from '../../../../constants/api.constants';

@Component({
  selector: 'app-add-fuel-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-fuel-expense.component.html',
  styleUrls: ['./add-fuel-expense.component.css'],
})
export class AddFuelExpenseComponent implements OnInit {
  fuelExpenseForm!: FormGroup;
  vehicles: any[] = [];

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.initForm();
  }

  // Load vehicle list from backend
  private loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  // Initialize Form with validation
  private initForm() {
    this.fuelExpenseForm = this.fb.group({
      vehicleId: ['', Validators.required],
      date: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.1)]],
      rate: ['', [Validators.required, Validators.min(1)]],
      amount: [{ value: '', disabled: true }, Validators.required], // Auto-calculated
      odometerReading: ['', Validators.required],
      location: ['', Validators.required],
      paymentMode: ['', Validators.required],
    });

    // Auto-calculate amount (Quantity * Rate)
    this.fuelExpenseForm.get('quantity')?.valueChanges.subscribe(() => this.updateAmount());
    this.fuelExpenseForm.get('rate')?.valueChanges.subscribe(() => this.updateAmount());
  }

  // Calculate amount dynamically
  public updateAmount(): void {
    const quantity = this.fuelExpenseForm.get('quantity')?.value || 0;
    const rate = this.fuelExpenseForm.get('rate')?.value || 0;
    this.fuelExpenseForm.patchValue({ amount: quantity * rate });
  }

  // Trim unnecessary spaces from location input
  trimLocation(): void {
    let location = this.fuelExpenseForm.get('location')?.value.trim();
    this.fuelExpenseForm.patchValue({ location });
  }

  // Navigate back to Fuel Expense Dashboard
  goBack() {
    this.router.navigate(['/fuel-expense']);
  }

  // Submit Fuel Expense to Backend API
  submitExpense() {
    if (this.fuelExpenseForm.invalid) {
      alert('⚠️ Please fill all required fields correctly.');
      return;
    }

    // Trim location field before submission
    this.trimLocation();

    const formData = this.fuelExpenseForm.getRawValue();
    const selectedVehicle = this.vehicles.find(v => v.vehicleId === formData.vehicleId);

    const requestPayload = {
      vehicleId: formData.vehicleId,
      vehicleRegistrationNumber: selectedVehicle?.registrationNumber || '',
      fuelFilledDate: formData.date,
      quantity: formData.quantity,
      rate: formData.rate,
      amount: formData.amount,
      odometerReading: formData.odometerReading,
      location: formData.location,
      paymentMode: formData.paymentMode
    };

    console.log('🚀 Sending Fuel Expense Data:', requestPayload);

    // Call the backend API
    this.http.post(`${API_URLS.VEHICLE_FUEL_EXPENSE_ENDPOINT}`, requestPayload).subscribe({
      next: (response: any) => {
        console.log('✅ Fuel expense added successfully:', response);
        alert('✅ Fuel expense recorded successfully!');
        this.fuelExpenseForm.reset();
        this.fuelExpenseForm.patchValue({ amount: '' }); // Keep amount field disabled
        this.router.navigate(['/fuel-expense']);
      },
      error: (error) => {
        console.error('❌ Error adding fuel expense:', error);
        alert(`❌ Failed to record fuel expense: ${error.error?.message || 'Something went wrong'}`);
      }
    });
  }
}

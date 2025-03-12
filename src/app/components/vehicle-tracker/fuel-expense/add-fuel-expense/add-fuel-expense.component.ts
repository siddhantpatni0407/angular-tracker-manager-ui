import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VehicleService } from '../../../../services/vehicle.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.initForm();
  }

  // Load vehicle list
  private loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  // Initialize Form
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
  public updateAmount(): void {  // ⬅ Changed from private to public
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

  // Submit Form
  submitExpense() {
    if (this.fuelExpenseForm.invalid) {
      alert('⚠️ Please fill all required fields correctly.');
      return;
    }

    // Trim location field before submission
    this.trimLocation();

    const fuelExpenseData = this.fuelExpenseForm.getRawValue(); // Include disabled fields
    console.log('🚀 Fuel Expense Data:', fuelExpenseData);

    alert('✅ Fuel expense recorded successfully!');
    this.fuelExpenseForm.reset();
    this.fuelExpenseForm.patchValue({ amount: '' }); // Keep amount field disabled
    this.router.navigate(['/fuel-expense']);
  }
}

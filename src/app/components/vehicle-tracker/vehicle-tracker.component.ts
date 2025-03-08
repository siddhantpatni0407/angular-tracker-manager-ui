import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-tracker',
  templateUrl: './vehicle-tracker.component.html',
  styleUrls: ['./vehicle-tracker.component.css']
})
export class VehicleTrackerComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  registerVehicle() {
    this.router.navigate(['/register-vehicle']);
  }

  fetchVehicles() {
    this.router.navigate(['/fetch-vehicle']);
  }

  viewVehicleList() {
    this.router.navigate(['/vehicle-list']);
  }

  viewCarExpenses() {
    this.router.navigate(['/car-expenses']);
  }

  viewServicingDetails() {
    this.router.navigate(['/servicing-details']);
  }

  viewTyreDetails() {
    this.router.navigate(['/tyre-details']);
  }

  viewPetrolExpenses() {
    this.router.navigate(['/petrol-expenses']);
  }

  viewInsuranceDetails() {
    this.router.navigate(['/insurance-details']);
  }
}

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

  viewCarExpenses() {
    this.router.navigate(['/vehicle-tracker']);
    //this.router.navigate(['/car-expenses']);
  }

  viewServicingDetails() {
    this.router.navigate(['/vehicle-tracker']);
    //this.router.navigate(['/servicing-details']);
  }

  viewTyreDetails() {
    this.router.navigate(['/vehicle-tracker']);
    //this.router.navigate(['/tyre-details']);
  }

  viewFuelExpenses() {
    this.router.navigate(['/fuel-expense']);
  }

  viewInsuranceDetails() {
    this.router.navigate(['/vehicle-tracker']);
    //this.router.navigate(['/insurance-details']);
  }

}
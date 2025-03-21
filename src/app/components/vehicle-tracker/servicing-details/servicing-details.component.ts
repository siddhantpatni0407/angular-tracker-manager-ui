import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicing-details',
  templateUrl: './servicing-details.component.html',
  styleUrls: ['./servicing-details.component.css']
})
export class ServicingDetailsComponent {
  constructor(private router: Router) {}

  // Navigate to add servicing page
  navigateToAddVehicleService() {
    this.router.navigate(['/add-vehicle-service']);
  }

  // Navigate to view servicing page
  navigateToViewVehicleService() {
    this.router.navigate(['/view-vehicle-service']);
  }

  // Navigate to servicing statistics page
  navigateToServicingStatistics() {
    this.router.navigate(['/servicing-statistics']);
  }

  // Navigate to servicing reports page
  navigateToServicingReports() {
    this.router.navigate(['/servicing-reports']);
  }

  // Go back to vehicle tracker page
  goBackToVehicleTracker(): void {
    this.router.navigate(['/vehicle-tracker']);
  }
}

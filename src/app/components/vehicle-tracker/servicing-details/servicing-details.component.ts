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
  navigateToAddServicing() {
    this.router.navigate(['/add-servicing']);
  }

  // Navigate to view servicing page
  navigateToViewServicing() {
    this.router.navigate(['/view-servicing']);
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

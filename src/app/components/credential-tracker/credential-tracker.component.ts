import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credential-tracker',
  templateUrl: './credential-tracker.component.html',
  styleUrls: ['./credential-tracker.component.css']
})
export class CredentialTrackerComponent {
  constructor(private router: Router) {}

  // Navigate to Add Credentials Page
  navigateToAddCredentials() {
    this.router.navigate(['/add-credentials']);
  }

  // Navigate to Fetch Credentials Page
  navigateToFetchCredentials() {
    this.router.navigate(['/fetch-credentials']);
  }

  // Go back to Fuel Expense Tracker
  goBackToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
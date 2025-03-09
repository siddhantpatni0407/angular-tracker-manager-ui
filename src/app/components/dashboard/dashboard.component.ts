import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Ensure RouterModule is imported
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userRole: string = 'Guest'; // Default role

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  /**
   * Checks if the user is authenticated and sets the role accordingly.
   * Redirects to login page if not authenticated.
   */
  private checkAuthentication(): void {
    const authToken = sessionStorage.getItem('authToken');
    
    if (!authToken) {
      this.redirectToLogin();
    } else {
      this.userRole = sessionStorage.getItem('userRole') || 'Guest';
    }
  }

  /**
   * Navigates to Medical Tracker page.
   */
  navigateToMedicalTracker(): void {
    this.router.navigate(['/medical-tracker']);
  }

  /**
   * Navigates to Vehicle Tracker page.
   */
  navigateToVehicleTracker(): void {
    this.router.navigate(['/vehicle-tracker']);
  }

  /**
   * Handles admin reports viewing.
   */
  viewReports(): void {
    console.log('Admin reports button clicked!');
    // Future implementation can go here
  }

  /**
   * Handles user-specific reports viewing.
   */
  viewUserReports(): void {
    console.log('User reports button clicked!');
    // Future implementation can go here
  }

  /**
   * Redirects the user to the login page.
   */
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}

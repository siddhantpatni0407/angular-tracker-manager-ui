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
  userName: string = 'User'; // Default name

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  /**
   * Checks if the user is authenticated and sets the name and role accordingly.
   * Redirects to login page if not authenticated.
   */
  private checkAuthentication(): void {
    const authToken = sessionStorage.getItem('authToken');
    
    if (!authToken) {
      this.redirectToLogin();
    } else {
      this.userRole = sessionStorage.getItem('userRole') || 'Guest';
      this.userName = sessionStorage.getItem('userName') || 'User';
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
   * Navigates to Stock Market Tracker page.
   */
  navigateToStockMarketTracker(): void {
    this.router.navigate(['/stock-market-tracker']);
  }

  /**
   * Navigates to Credenetial Tracker page.
   */
  navigateToCredentialTracker(): void {
    this.router.navigate(['/credential-tracker']);
  }

  // Added this new method for Financial Tracker
  navigateToFinancialTracker(): void {
    this.router.navigate(['/financial-tracker']);
  }

  /**
   * Navigates to User Profile page.
   */
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * Logs out the user and redirects to login page.
   */
  logout(): void {
    sessionStorage.clear(); // Clears session data
    this.router.navigate(['/login']);
  }

  /**
   * Redirects the user to the login page.
   */
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}

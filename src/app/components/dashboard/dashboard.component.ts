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
  userRole: string = 'Guest';
  userName: string = 'User';
  lastLoginTime: string | null = null;
  showLastLogin: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.setupLastLoginNotification();
  }

  private checkAuthentication(): void {
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      this.redirectToLogin();
    } else {
      this.userRole = sessionStorage.getItem('userRole') || 'Guest';
      this.userName = sessionStorage.getItem('userName') || 'User';
      this.lastLoginTime = sessionStorage.getItem('lastLoginTime');
    }
  }

  private setupLastLoginNotification(): void {
    if (this.lastLoginTime) {
      this.showLastLogin = true;

      // Hide after 10 seconds
      setTimeout(() => {
        this.showLastLogin = false;
      }, 10000);
    }
  }

  // In your dashboard.component.ts
  getUserInitials(): string {
    if (!this.userName) return '?';

    // Split name by spaces and get first letters
    const names = this.userName.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
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

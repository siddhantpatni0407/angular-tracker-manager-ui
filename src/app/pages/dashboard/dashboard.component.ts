import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  userRole: string = '';

  constructor(private router: Router) {
    // Retrieve the role from sessionStorage
    this.userRole = sessionStorage.getItem('userRole') || 'Guest';
  }

  viewReports(): void {
    // Implement functionality to show admin reports or navigate to reports page
    console.log('Admin reports button clicked!');
    // Example: this.router.navigate(['/admin-reports']);
  }

  viewUserReports(): void {
    // Implement functionality to show user-specific reports or navigate to a user dashboard page
    console.log('User reports button clicked!');
    // Example: this.router.navigate(['/user-reports']);
  }

  redirectToLogin(): void {
    // Redirect guest to login page
    this.router.navigate(['/login']);
  }

  logout(): void {
    // Clear session data
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');

    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
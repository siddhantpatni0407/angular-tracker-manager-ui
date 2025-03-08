import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here if needed
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userRole: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if the user is logged in
    const isLoggedIn = !!sessionStorage.getItem('authToken');

    if (!isLoggedIn) {
      // Redirect to the login page if the user is not logged in
      this.router.navigate(['/login']);
    } else {
      // Retrieve the role from sessionStorage
      this.userRole = sessionStorage.getItem('userRole') || 'Guest';
    }
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
}

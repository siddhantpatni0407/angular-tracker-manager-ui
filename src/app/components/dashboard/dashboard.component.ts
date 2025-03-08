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
  userRole: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const isLoggedIn = !!sessionStorage.getItem('authToken');

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.userRole = sessionStorage.getItem('userRole') || 'Guest';
    }
  }

  navigateToMedicalTracker(): void {
    this.router.navigate(['/medical-tracker']); // ✅ Update route accordingly
  }

  navigateToVehicleTracker(): void {
    this.router.navigate(['/vehicle-tracker']); // ✅ Update route accordingly
  }

  viewReports(): void {
    console.log('Admin reports button clicked!');
  }

  viewUserReports(): void {
    console.log('User reports button clicked!');
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userRole: string = '';

  constructor() {
    // ✅ Retrieve role from sessionStorage (fallback to localStorage)
    this.userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole') || 'Guest';
  }
}
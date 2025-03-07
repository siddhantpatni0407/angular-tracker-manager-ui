import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-navbar',
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, DoCheck {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  ngDoCheck(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    // Check if there's an auth token in sessionStorage
    this.isLoggedIn = !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    this.isLoggedIn = false; // Update login status
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  refreshPage(): void {
    window.location.reload();
  }
}

import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { DatePipe } from '@angular/common'; // Import DatePipe

@Component({
  selector: 'app-navbar',
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe] // Provide DatePipe
})
export class NavbarComponent implements OnInit, DoCheck {
  isLoggedIn: boolean = false;
  currentDate: Date = new Date();

  constructor(private router: Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    // Update the date every second
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngDoCheck(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    // Check if there's an auth token in sessionStorage
    this.isLoggedIn = !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    // Remove auth token and user role from sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    
    // Set login status to false
    this.isLoggedIn = false;

    // Navigate to the login page
    this.router.navigate(['/login']);
  }

  refreshPage(): void {
    window.location.reload();
  }
}
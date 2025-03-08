import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule], // Enable Standalone Component
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe] // Provide DatePipe
})
export class NavbarComponent implements OnInit, DoCheck {
  isLoggedIn: boolean = false;
  currentDate: Date = new Date();
  isDarkMode: boolean = false;

  constructor(private router: Router, private datePipe: DatePipe, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadDarkModePreference();

    // Update the date every second without triggering unnecessary change detection
    setInterval(() => {
      this.currentDate = new Date();
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 1000);
  }

  ngDoCheck(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  refreshPage(): void {
    window.location.reload();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    this.applyDarkMode();
  }

  loadDarkModePreference(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyDarkMode();
  }

  applyDarkMode(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}

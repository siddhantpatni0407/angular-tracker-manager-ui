import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URLS } from '../../constants/api.constants';

// Define User Interface
interface User {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  isActive: boolean; // Added isActive field
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  activeUsers: number = 0;
  totalUsers: number = 0;
  pendingRequests: number = 0;
  loading: boolean = true;
  errorMessage: string = '';
  deletingUserId: number | null = null;

  userName: string = 'Admin';
  userRole: string = 'ADMIN';
  lastLoginTime: string | null = null;
  showLastLogin: boolean = false;

  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchUsers();
    this.loadAdminDetails();
    this.setupLastLoginNotification();
  }

  /** ✅ Fetch logged-in admin details from session */
  private loadAdminDetails(): void {
    this.userName = sessionStorage.getItem('userName') || 'Admin';
    this.userRole = sessionStorage.getItem('userRole') || 'ADMIN';
    this.lastLoginTime = sessionStorage.getItem('lastLoginTime');
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

  getUserInitials(): string {
    if (!this.userName) return '?';

    const names = this.userName.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  /** ✅ Fetch all users excluding admin users */
  fetchUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http
      .get<{ status: string; message: string; data: any[] }>(
        API_URLS.FETCH_ALL_USERS_ENDPOINT
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS' && Array.isArray(response.data)) {
            this.users = response.data
              .filter((user) => user.role !== 'ADMIN')
              .map((user) => ({
                id: user.userId,
                name: user.username,
                email: user.email,
                mobileNumber: user.mobileNumber || 'N/A',
                role: user.role,
                isActive: user.isActive, // Added isActive mapping
              }));

            this.totalUsers = this.users.length;
            this.activeUsers = this.users.filter(
              (user) => user.isActive // Changed from role check to isActive check
            ).length;
            this.pendingRequests = Math.floor(Math.random() * 5);
          } else {
            this.errorMessage = 'Unexpected response format from server.';
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch user data. Please try again!';
          this.loading = false;
          console.error('Fetch Users Error:', err);
        },
      });
  }

  /** ✅ Delete a user */
  deleteUser(userId: number): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.deletingUserId = userId;
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      this.errorMessage = 'Authentication token missing. Please log in again.';
      this.deletingUserId = null;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${authToken}` });
    const params = new HttpParams().set('userId', userId.toString());

    this.http
      .delete<{ status: string; message: string }>(API_URLS.USER_ENDPOINT, {
        headers,
        params,
      })
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.users = this.users.filter((user) => user.id !== userId);
            this.totalUsers--;
            this.activeUsers = this.users.filter(
              (user) => user.isActive // Changed from role check to isActive check
            ).length;
            alert(response.message);
          } else {
            this.errorMessage = 'Failed to delete user!';
          }
          this.deletingUserId = null;
        },
        error: (err) => {
          console.error('Delete API Error:', err);
          this.errorMessage =
            err.error?.message || 'An error occurred while deleting the user.';
          this.deletingUserId = null;
        },
      });
  }

  /**
   * ✅ Navigates to User Profile page.
   */
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * ✅ Logs out the user and redirects to login page.
   */
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}

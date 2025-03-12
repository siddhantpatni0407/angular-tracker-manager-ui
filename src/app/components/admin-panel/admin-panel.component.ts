import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URLS } from '../../constants/api.constants';

// Define a User Interface
interface User {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  activeUsers: number = 0;
  pendingRequests: number = 0;
  loading: boolean = true;
  errorMessage: string = '';
  deletingUserId: number | null = null;

  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchUsers();
  }

  /** Fetch all users from the backend */
  fetchUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<{ status: string; message: string; data: any[] }>(API_URLS.FETCH_ALL_USERS_ENDPOINT)
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS' && Array.isArray(response.data)) {
            this.users = response.data
              .filter(user => user.role === 'USER')
              .map(user => ({
                id: user.userId,
                name: user.username,
                email: user.email,
                mobileNumber: user.mobileNumber || 'N/A',
                role: user.role
              }));

            this.activeUsers = this.users.length;
            this.pendingRequests = Math.floor(Math.random() * 5); // Mock pending requests
          } else {
            this.errorMessage = 'Unexpected response format from server.';
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch user data. Please try again!';
          this.loading = false;
          console.error('Fetch Users Error:', err);
        }
      });
  }

  /** Delete user */
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

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });
    const params = new HttpParams().set('userId', userId.toString());

    this.http.delete<{ status: string; message: string }>(API_URLS.USER_ENDPOINT, { headers, params })
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.users = this.users.filter(user => user.id !== userId);
            alert(response.message);
          } else {
            this.errorMessage = 'Failed to delete user!';
          }
          this.deletingUserId = null;
        },
        error: (err) => {
          console.error('Delete API Error:', err);
          this.errorMessage = err.error?.message || 'An error occurred while deleting the user.';
          this.deletingUserId = null;
        }
      });
  }
}

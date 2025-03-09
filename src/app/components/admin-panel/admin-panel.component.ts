import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URLS } from '../../constants/api.constants';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  users: any[] = [];
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
    this.http.get<{ status: string; message: string; data: any[] }>(API_URLS.FETCH_ALL_USERS_ENDPOINT)
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS' && response.data) {
            // Filter users with role 'USER' only and include mobile number
            this.users = response.data
              .filter(user => user.role === 'USER')
              .map(user => ({
                id: user.userId,
                name: user.username,
                email: user.email,
                mobileNumber: user.mobileNumber || 'N/A',  // ✅ Include mobile number
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
          this.errorMessage = 'Failed to fetch user data!';
          this.loading = false;
          console.error('Fetch Users Error:', err);
        }
      });
  }

  /** Delete user */
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deletingUserId = userId;
  
      console.log('Calling DELETE API:', `${API_URLS.USER_ENDPOINT}?userId=${userId}`);
  
      this.http.delete<any>(`${API_URLS.USER_ENDPOINT}`, {
        params: { userId: userId.toString() },
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })
        .subscribe({
          next: (response) => {
            console.log('Delete API Response:', response);
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
            if (err.status === 404) {
              this.errorMessage = err.error.message || 'User not found!';
            } else {
              this.errorMessage = 'Failed to delete user!';
            }
            this.deletingUserId = null;
          }
        });
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';
import { LoginRequest } from '../../../models/login-request'; // Import the LoginRequest model

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  selectedRole: string = ''; // Default empty role
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  submitted: boolean = false; // Track form submission for validation
  private apiUrl = API_URLS.USER_LOGIN_ENDPOINT;

  // Use `inject()` for standalone components
  private http = inject(HttpClient);
  private router = inject(Router);

  login(): void {
    this.submitted = true; // Mark form as submitted

    if (!this.email.trim() || !this.password.trim() || !this.selectedRole) {
      this.errorMessage = '❌ Please fill all fields and select a role.';
      return;
    }

    const loginPayload: LoginRequest = { email: this.email, password: this.password };

    this.isLoading = true;
    this.errorMessage = ''; 
    this.successMessage = ''; 

    this.http.post<any>(this.apiUrl, loginPayload).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.status === 'SUCCESS') {
          const apiRole = response.role;

          if (apiRole !== this.selectedRole) {
            this.errorMessage = ` Invalid role`;
            return;
          }

          this.successMessage = response.message || '✅ Login successful! Redirecting...';

          // Store token and role in sessionStorage
          sessionStorage.setItem('authToken', response.token);
          sessionStorage.setItem('userRole', apiRole);

          // Determine redirection URL
          const redirectUrl = apiRole === 'USER' ? '/dashboard' : '/admin-panel';

          console.log(`🔄 Redirecting to ${redirectUrl} in 2 seconds...`);

          setTimeout(() => {
            this.router.navigate([redirectUrl])
              .then((navigated) => {
                if (!navigated) {
                  this.errorMessage = '❌ Unable to redirect. Please try again.';
                }
              });
          }, 2000);
          
        } else {
          this.errorMessage = response.message || '❌ Invalid credentials.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || '❌ Login failed. Please try again.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}

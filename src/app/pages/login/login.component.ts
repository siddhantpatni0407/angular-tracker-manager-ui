import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../constants/api.constants';

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
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  private apiUrl = API_URLS.LOGIN;

  // Use `inject()` for standalone components
  private http = inject(HttpClient);
  private router = inject(Router);

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = '❌ Please enter email and password.';
      console.warn('⚠️ Invalid Login Submission:', { Email: this.email });
      return;
    }

    const loginPayload = { email: this.email, password: this.password };
    console.log('📢 Logging in with:', loginPayload);

    this.isLoading = true;
    this.errorMessage = ''; 
    this.successMessage = ''; 

    this.http.post<any>(this.apiUrl, loginPayload).subscribe({
      next: (response) => {
        console.log('✅ Login Successful:', response);
        this.isLoading = false;

        if (response.status === 'SUCCESS') {
          this.successMessage = response.message || 'Login successful! Redirecting...';

          // Store token and role in sessionStorage (for security)
          sessionStorage.setItem('authToken', response.token);
          sessionStorage.setItem('userRole', response.role);

          console.log('🔄 Redirecting to /dashboard in 2 seconds...');

          // 🔄 Delayed Navigation (similar to Register)
          setTimeout(() => {
            this.router.navigate(['/dashboard'])
              .then((navigated) => {
                if (navigated) {
                  console.log('✅ Successfully navigated to Dashboard!');
                } else {
                  console.error('⚠️ Navigation Failed');
                  this.errorMessage = '❌ Unable to redirect. Please try again.';
                }
              });
          }, 2000); // ✅ Delay added to show success message
          
        } else {
          this.errorMessage = response.message || 'Invalid credentials.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || '❌ Login failed. Please try again.';
        console.error('❌ Login Error:', error);
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
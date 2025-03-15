import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';

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
  selectedRole: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  submitted: boolean = false;
  isForgotPassword: boolean = false;
  otpRequested: boolean = false;
  forgotEmail: string = '';
  otp: string = '';
  newPassword: string = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  // 🚀 Login API Call
  login(): void {
    this.submitted = true;
    if (!this.email.trim() || !this.password.trim() || !this.selectedRole) {
      this.errorMessage = '❌ Please fill all fields and select a role.';
      return;
    }

    const loginPayload = { email: this.email, password: this.password };

    this.isLoading = true;
    this.http.post<any>(API_URLS.USER_LOGIN_ENDPOINT, loginPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'SUCCESS') {
          sessionStorage.setItem('authToken', response.token);
          sessionStorage.setItem('userRole', response.role);
          this.successMessage = '✅ Login successful! Redirecting...';
          setTimeout(() => this.router.navigate([response.role === 'USER' ? '/dashboard' : '/admin-panel']), 2000);
        } else {
          this.errorMessage = '❌ Invalid credentials.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = '❌ Login failed. Please try again.';
      }
    });
  }

  // 🔄 Toggle Login/Forgot Password View
  toggleForgotPassword(): void {
    this.isForgotPassword = !this.isForgotPassword;
    this.otpRequested = false;
    this.forgotEmail = '';
    this.otp = '';
    this.newPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  // 🔑 Request OTP / Reset Password
  requestOtpOrResetPassword(): void {
    if (!this.otpRequested) {
      // Request OTP
      this.http.post<any>(API_URLS.FORGOT_PASSWORD_REQUEST_OTP_ENDPOINT, { email: this.forgotEmail }).subscribe({
        next: () => {
          this.otpRequested = true;
          this.successMessage = '✅ OTP sent to your email!';
        },
        error: () => {
          this.errorMessage = '❌ Failed to send OTP. Please try again.';
        }
      });
    } else {
      // Reset Password
      const resetPayload = { email: this.forgotEmail, otp: this.otp, newPassword: this.newPassword };
      this.http.post<any>(API_URLS.FORGOT_PASSWORD_RESET_ENDPOINT, resetPayload).subscribe({
        next: () => {
          this.successMessage = '✅ Password reset successful! Redirecting...';
          setTimeout(() => this.toggleForgotPassword(), 2000);
        },
        error: () => {
          this.errorMessage = '❌ Invalid OTP or error resetting password.';
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}

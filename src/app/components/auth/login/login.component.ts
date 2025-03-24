import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  selectedRole: string = '';
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isForgotPassword: boolean = false;
  isOtpLogin: boolean = false;
  otpRequestedForLogin: boolean = false;
  otpRequestedForForgotPassword: boolean = false;
  emailForOtp: string = '';
  otpForLogin: string = '';
  forgotEmail: string = '';
  otpForForgotPassword: string = '';
  newPassword: string = '';

  // Security status fields
  remainingAttempts: number | null = null;
  accountLocked: boolean = false;
  lastLoginTime: Date | null = null;

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  // 🚀 Login with Email & Password
  login(): void {
    if (!this.email || !this.password || !this.selectedRole) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.resetStatusMessages();
    this.isLoading = true;

    const loginPayload = {
      email: this.email,
      password: this.password,
      role: this.selectedRole,
    };

    this.authService.login(loginPayload).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.status === 'SUCCESS' && response.token) {
          this.handleSuccessfulLogin(response);
        } else {
          this.handleFailedLogin(response);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = 'Error logging in. Please try again!';
      },
    });
  }

  private handleSuccessfulLogin(response: any): void {
    // Store user data
    sessionStorage.setItem('authToken', response.token);
    sessionStorage.setItem('userId', response.userId?.toString() || '');
    sessionStorage.setItem('userRole', response.role);
    sessionStorage.setItem('userName', response.name || '');

    // Store security info
    if (response.lastLoginTime) {
      this.lastLoginTime = new Date(response.lastLoginTime);
      sessionStorage.setItem('lastLoginTime', this.lastLoginTime.toString());
    }

    // Show success message
    this.successMessage = `Welcome back, ${response.name || 'User'}!`;

    // Redirect based on role
    setTimeout(() => this.redirectUser(response.role), 1500);
  }

  private handleFailedLogin(response: any): void {
    this.errorMessage = response.message || 'Invalid credentials!';

    // Display security information
    if (
      response.loginAttempts !== undefined &&
      response.loginAttempts !== null
    ) {
      this.remainingAttempts = Math.max(0, 5 - response.loginAttempts);
    }

    if (response.accountLocked) {
      this.accountLocked = true;
      this.errorMessage = 'Account locked. Please contact support.';
    }

    if (response.lastLoginTime) {
      this.lastLoginTime = new Date(response.lastLoginTime);
    }
  }

  redirectUser(role: string) {
    const normalizedRole = role?.toUpperCase();

    switch (normalizedRole) {
      case 'ADMIN':
        this.router.navigate(['/admin-panel']);
        break;
      case 'USER':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.errorMessage = 'Unknown role. Contact support!';
    }
  }

  // 🔢 Request OTP & Login with OTP
  loginWithOtp(): void {
    this.resetStatusMessages();
    this.isLoading = true;

    if (!this.otpRequestedForLogin) {
      // Request OTP
      this.http
        .post(API_URLS.LOGIN_REQUEST_OTP_ENDPOINT, { email: this.emailForOtp })
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.otpRequestedForLogin = true;
            this.successMessage = 'OTP sent to your email!';
          },
          error: (error) => {
            this.isLoading = false;
            console.error('OTP request failed:', error);
            this.errorMessage = 'Failed to send OTP. Please try again.';
          },
        });
    } else {
      // Verify OTP & Login
      const otpPayload = { email: this.emailForOtp, otp: this.otpForLogin };
      this.http.post(API_URLS.VERIFY_OTP_ENDPOINT, otpPayload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.status === 'SUCCESS' && response.token) {
            this.handleSuccessfulLogin(response);
          } else {
            this.errorMessage = response.message || 'Invalid OTP.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('OTP verification failed:', error);
          this.errorMessage = 'OTP verification failed.';
        },
      });
    }
  }

  // 🔑 Forgot Password Flow
  onForgotPasswordSubmit(): void {
    this.resetStatusMessages();
    this.isLoading = true;

    if (!this.otpRequestedForForgotPassword) {
      // Request OTP
      this.http
        .post(API_URLS.FORGOT_PASSWORD_REQUEST_OTP_ENDPOINT, {
          email: this.forgotEmail,
        })
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.otpRequestedForForgotPassword = true;
            this.successMessage = 'OTP sent to your email!';
          },
          error: (error) => {
            this.isLoading = false;
            console.error('OTP request failed:', error);
            this.errorMessage = 'Failed to send OTP. Please try again.';
          },
        });
    } else {
      // Reset Password
      const resetPayload = {
        email: this.forgotEmail,
        otp: this.otpForForgotPassword,
        newPassword: this.newPassword,
      };

      this.http
        .post(API_URLS.FORGOT_PASSWORD_RESET_ENDPOINT, resetPayload)
        .subscribe({
          next: (response: any) => {
            this.isLoading = false;
            if (response.status === 'SUCCESS') {
              this.successMessage = 'Password reset successful!';
              setTimeout(() => this.toggleForgotPassword(), 2000);
            } else {
              this.errorMessage = response.message || 'Password reset failed.';
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Password reset error:', error);
            this.errorMessage = 'Invalid OTP or error resetting password.';
          },
        });
    }
  }

  // 🔄 Toggle Forms
  toggleOtpLogin(): void {
    this.resetStatusMessages();
    this.isOtpLogin = !this.isOtpLogin;
    this.otpRequestedForLogin = false;
    this.emailForOtp = '';
    this.otpForLogin = '';
  }

  toggleForgotPassword(): void {
    this.resetStatusMessages();
    this.isForgotPassword = !this.isForgotPassword;
    this.otpRequestedForForgotPassword = false;
    this.forgotEmail = '';
    this.otpForForgotPassword = '';
    this.newPassword = '';
  }

  // 👀 Toggle Password Visibility
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔗 Navigation
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // 🛠️ Helper Methods
  private resetStatusMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.remainingAttempts = null;
    this.accountLocked = false;
    // Keep lastLoginTime as it might be useful for display
  }
}

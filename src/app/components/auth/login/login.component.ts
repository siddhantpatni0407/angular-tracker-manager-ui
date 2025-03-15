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
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  submitted: boolean = false;
  isForgotPassword: boolean = false;
  isOtpLogin: boolean = false;
  otpRequestedForLogin: boolean = false;
  otpRequestedForForgotPassword: boolean = false;
  emailForOtp: string = '';
  otpForLogin: string = '';
  forgotEmail: string = '';
  otpForForgotPassword: string = '';
  newPassword: string = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  // 🚀 Login with Email & Password
  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    const loginPayload = { email: this.email, password: this.password };

    this.authService.login(loginPayload).subscribe({
      next: (response) => {
        console.log('Login response:', response); // Debugging

        if (response.status === 'SUCCESS' && response.token) {
          // Store the token and role in sessionStorage or localStorage
          sessionStorage.setItem('authToken', response.token);
          sessionStorage.setItem('userRole', response.role);

          // Show success message
          this.successMessage = '✅ Login successful! Redirecting...';

          // Redirect based on role
          setTimeout(() => this.redirectUser(response.role), 2000);
        } else {
          // Handle invalid credentials
          this.errorMessage = '❌ Invalid credentials!';
        }
      },
      error: (error) => {
        console.error('Login error:', error); // Debugging
        this.errorMessage = '❌ Error logging in. Please try again!';
      },
    });
  }

  redirectUser(role: string) {
    const normalizedRole = role.toUpperCase();

    if (normalizedRole === 'ADMIN') {
      this.router.navigate(['/admin-panel']);
    } else if (normalizedRole === 'USER') {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Unknown role. Contact support!';
    }
  }

  // 🔢 Request OTP & Login with OTP
  loginWithOtp(): void {
    if (!this.otpRequestedForLogin) {
      // Request OTP
      this.http
        .post<any>(API_URLS.LOGIN_REQUEST_OTP_ENDPOINT, {
          email: this.emailForOtp,
        })
        .subscribe({
          next: () => {
            this.otpRequestedForLogin = true;
            this.successMessage = '✅ OTP sent to your email!';
          },
          error: () => {
            this.errorMessage = '❌ Failed to send OTP. Please try again.';
          },
        });
    } else {
      // Verify OTP & Login
      const otpPayload = { email: this.emailForOtp, otp: this.otpForLogin };
      this.http.post<any>(API_URLS.VERIFY_OTP_ENDPOINT, otpPayload).subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS' && response.token) {
            sessionStorage.setItem('authToken', response.token);
            sessionStorage.setItem('userRole', response.role.toUpperCase());
            this.successMessage = '✅ Login successful! Redirecting...';
            setTimeout(
              () => this.redirectUser(response.role.toUpperCase()),
              2000
            );
          } else {
            this.errorMessage = '❌ Invalid OTP.';
          }
        },
        error: () => {
          this.errorMessage = '❌ OTP verification failed.';
        },
      });
    }
  }

  // New method to handle form submission
  onForgotPasswordSubmit(form: any): void {
    console.log('Forgot Password Form Submitted:', form.value); // Debugging
    this.requestOtpOrResetPassword();
  }

  // Existing method
  requestOtpOrResetPassword(): void {
    console.log('Request OTP or Reset Password method called'); // Debugging

    if (!this.otpRequestedForForgotPassword) {
      // Request OTP for Forgot Password
      console.log('Requesting OTP for email:', this.forgotEmail); // Debugging

      this.http
        .post<any>(API_URLS.FORGOT_PASSWORD_REQUEST_OTP_ENDPOINT, {
          email: this.forgotEmail,
        })
        .subscribe({
          next: () => {
            this.otpRequestedForForgotPassword = true;
            this.successMessage = '✅ OTP sent to your email!';
            console.log('OTP requested successfully'); // Debugging
          },
          error: (error) => {
            console.error('OTP request failed:', error); // Debugging
            this.errorMessage = '❌ Failed to send OTP. Please try again.';
          },
        });
    } else {
      // Reset Password
      console.log('Resetting password with OTP:', this.otpForForgotPassword); // Debugging

      const resetPayload = {
        email: this.forgotEmail,
        otp: this.otpForForgotPassword,
        newPassword: this.newPassword,
      };

      console.log('Reset Password Payload:', resetPayload); // Debugging

      this.http
        .post<any>(API_URLS.FORGOT_PASSWORD_RESET_ENDPOINT, resetPayload)
        .subscribe({
          next: (response) => {
            console.log('Password reset response:', response); // Debugging
            if (response.status === 'SUCCESS') {
              this.successMessage =
                '✅ Password reset successful! Redirecting...';
              setTimeout(() => this.toggleForgotPassword(), 2000);
            } else {
              this.errorMessage = '❌ Password reset failed. Please try again.';
            }
          },
          error: (error) => {
            console.error('Password reset error:', error); // Debugging
            this.errorMessage = '❌ Invalid OTP or error resetting password.';
          },
        });
    }
  }

  // 🔄 Toggle OTP Login Form
  toggleOtpLogin(): void {
    this.isOtpLogin = !this.isOtpLogin;
    this.otpRequestedForLogin = false;
    this.emailForOtp = '';
    this.otpForLogin = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  // 🔄 Toggle Forgot Password Form
  toggleForgotPassword(): void {
    this.isForgotPassword = !this.isForgotPassword;
    this.otpRequestedForForgotPassword = false;
    this.forgotEmail = '';
    this.otpForForgotPassword = '';
    this.newPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  // 👀 Toggle Password Visibility
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔗 Navigate to Register Page
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}

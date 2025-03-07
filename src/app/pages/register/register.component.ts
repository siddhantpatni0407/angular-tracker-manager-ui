import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ Import Router for navigation
import { HttpClient } from '@angular/common/http'; // ✅ Import HttpClient for API calls

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ RouterModule required for navigation
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  mobile: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  private apiUrl = 'http://localhost:8069/api/v1/tracker-manager-service/user/register'; // ✅ Change to match your backend

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    if (this.isFormValid()) {
      const userPayload = {
        name: this.name,
        mobile: this.mobile,
        email: this.email,
        password: this.password
      };

      console.log('📢 Registering User:', userPayload); // ✅ Log request in console

      this.isLoading = true;

      this.http.post<any>(this.apiUrl, userPayload).subscribe({
        next: (response) => {
          console.log('✅ Registration Successful:', response);
          this.isLoading = false;
          localStorage.setItem('token', response.token); // ✅ Store JWT
          this.router.navigate(['/dashboard']); // ✅ Navigate after success
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = '❌ Registration failed. Please try again.';
          console.error('❌ Registration Error:', error);
        }
      });
    } else {
      this.errorMessage = '❌ Please fill all fields correctly.';
      console.warn('⚠️ Invalid Form Submission:', { Name: this.name, Mobile: this.mobile, Email: this.email });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private isFormValid(): boolean {
    return (
      this.name.trim().length >= 3 &&
      /^[0-9]{10}$/.test(this.mobile) &&
      /\S+@\S+\.\S+/.test(this.email) &&
      this.password.trim().length >= 6
    );
  }
}

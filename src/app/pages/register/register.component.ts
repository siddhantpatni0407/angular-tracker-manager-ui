import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  mobile: string = '';
  email: string = '';
  password: string = '';
  role: string = ''; // ✅ Added role property
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  private apiUrl = 'http://localhost:8069/api/v1/tracker-manager-service/user/register';

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    if (this.isFormValid()) {
      const userPayload = {
        name: this.name,
        mobileNumber: this.mobile, // ✅ Fixed: Changed 'mobile' to 'mobileNumber'
        email: this.email,
        password: this.password,
        role: this.role // ✅ Sending role in request
      };

      console.log('📢 Registering User:', userPayload);

      this.isLoading = true;

      this.http.post<any>(this.apiUrl, userPayload).subscribe({
        next: (response) => {
          console.log('✅ Registration Successful:', response);
          this.isLoading = false;
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = '❌ Registration failed. Please try again.';
          console.error('❌ Registration Error:', error);
        }
      });
    } else {
      this.errorMessage = '❌ Please fill all fields correctly.';
      console.warn('⚠️ Invalid Form Submission:', { Name: this.name, Mobile: this.mobile, Email: this.email, Role: this.role });
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
      this.password.trim().length >= 6 &&
      this.role.trim().length > 0 // ✅ Ensure role is selected
    );
  }
}

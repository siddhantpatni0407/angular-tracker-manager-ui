import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule for navigation

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ Added RouterModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // ✅ Fixed property name: styleUrls (not styleUrl)
})
export class RegisterComponent {
  name: string = '';
  mobile: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  register(): void {
    if (this.isFormValid()) {
      console.table({ Name: this.name, Mobile: this.mobile, Email: this.email });
      
      // TODO: Implement API call for registration
      // Example: this.authService.register({ name: this.name, mobile: this.mobile, email: this.email, password: this.password }).subscribe();
    } else {
      console.log('❌ Please fill all fields correctly.');
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private isFormValid(): boolean {
    return (
      this.name.trim().length >= 3 &&
      /^[0-9]{10}$/.test(this.mobile) &&  // Validate 10-digit mobile number
      /\S+@\S+\.\S+/.test(this.email) &&  // Basic email validation
      this.password.trim().length >= 6
    );
  }
}

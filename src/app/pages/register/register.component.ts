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
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  register(): void {
    if (this.name && this.email && this.password) {
      console.log('Registering user:', { name: this.name, email: this.email });
      // TODO: Implement API call for registration
    } else {
      console.log('Please fill all fields.');
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}

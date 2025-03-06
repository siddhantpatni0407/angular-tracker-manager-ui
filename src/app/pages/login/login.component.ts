import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ Add RouterModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  login() {
    if (this.email && this.password) {
      console.log('Logging in with:', this.email, this.password);
      // Add actual authentication logic here
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

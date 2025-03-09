import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../constants/api.constants';

interface User {
  userId: number;
  username: string;
  email: string;
  mobileNumber: string;
  role: string;
}

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  userForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  // Initialize the form with validation
  initForm() {
    this.userForm = this.fb.group({
      userId: [{ value: '', disabled: true }], // Disabled ID field
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  // Load user data from localStorage or API
  loadUserData() {
    const userData = localStorage.getItem('userToEdit');

    if (userData) {
      try {
        const user: User = JSON.parse(userData);
        console.log('🚀 Loaded User Data:', user);

        if (!user.userId) {
          throw new Error('Invalid user data: Missing userId');
        }

        this.userForm.patchValue(user);
      } catch (error) {
        console.error('⚠️ Error parsing user data:', error);
        this.errorMessage = '⚠️ Invalid user data found!';
      }
    } else {
      this.fetchUserFromAPI();
    }
  }

  // Fetch user details from API
  fetchUserFromAPI() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    if (!userId) {
      this.errorMessage = '⚠️ No user ID provided!';
      return;
    }

    this.isLoading = true;
    this.http.get<any>(`${API_URLS.USER_ENDPOINT}?userId=${userId}`).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data) {
          this.userForm.patchValue(response.data);
          localStorage.setItem('userToEdit', JSON.stringify(response.data));
        } else {
          this.errorMessage = '⚠️ Failed to fetch user details!';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = '⚠️ Failed to fetch user details!';
        this.isLoading = false;
        console.error('Fetch User Error:', err);
      },
    });
  }

  // Submit updated user data to backend
  updateUser() {
    if (this.userForm.invalid) {
      alert('⚠️ Please fill all required fields!');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updatedUser: User = this.userForm.getRawValue(); // Get all form values

    console.log('🚀 Submitting Updated User Data:', updatedUser);

    this.http.put(`${API_URLS.USER_ENDPOINT}?userId=${updatedUser.userId}`, updatedUser).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          alert('✅ User updated successfully!');
          localStorage.removeItem('userToEdit');
          this.router.navigate(['/admin-panel']);
        } else {
          this.errorMessage = '⚠️ User update failed.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = error.status === 404 ? '⚠️ User not found.' : '❌ Failed to update user. Please try again.';
        this.isLoading = false;
      },
    });
  }

  // Cancel Update and navigate back
  cancelUpdate() {
    this.router.navigate(['/admin-panel']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../constants/api.constants';
import { AccountType } from '../../../enums/account-type.enum'; // Import AccountType Enum

@Component({
  selector: 'app-add-credential',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-credentials.component.html',
  styleUrls: ['./add-credentials.component.css'],
})
export class AddCredentialsComponent implements OnInit {
  credentialForm!: FormGroup;
  userId!: number; // Non-null assertion operator
  accountTypes = Object.values(AccountType); // Convert enum to array

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Fetch userId from session storage (assuming it is stored there after login)
    this.userId = Number(sessionStorage.getItem('userId')); // Adjust this based on how the userId is stored
    this.initForm();
  }

  // Initialize Form with validation
  private initForm() {
    this.credentialForm = this.fb.group({
      accountName: ['', Validators.required],
      accountType: ['', Validators.required],
      website: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)$/)]],
      url: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)$/)]],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      password: ['', Validators.required],
      status: ['', Validators.required],
      remarks: [''],
    });
  }

  // Navigate back to Credential Tracker
  goBack() {
    this.router.navigate(['/credential-tracker']);
  }

  // Format URL for opening in a new tab
  formatUrl(url: string): string {
    return url.startsWith('http') ? url : `https://${url}`;
  }

  // Submit Credential to Backend API
  submitCredential() {
    if (this.credentialForm.invalid) {
      alert('⚠️ Please fill all required fields correctly.');
      return;
    }

    const formData = this.credentialForm.getRawValue();
    const requestPayload = {
      userId: this.userId,
      ...formData,
    };

    console.log('🚀 Sending Credential Data:', requestPayload);

    // Call the backend API
    this.http.post(`${API_URLS.CREDENTIALS_ENDPOINT}`, requestPayload).subscribe({
      next: (response: any) => {
        console.log('✅ Credential saved successfully:', response);
        alert('✅ Credential saved successfully!');
        this.credentialForm.reset();
        this.router.navigate(['/credential-tracker']);
      },
      error: (error) => {
        console.error('❌ Error saving credential:', error);
        alert(
          `❌ Failed to save credential: ${
            error.error?.message || 'Something went wrong'
          }`
        );
      },
    });
  }
}

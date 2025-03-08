import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medical-tracker',
  templateUrl: './medical-tracker.component.html',
  styleUrls: ['./medical-tracker.component.css']
})
export class MedicalTrackerComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

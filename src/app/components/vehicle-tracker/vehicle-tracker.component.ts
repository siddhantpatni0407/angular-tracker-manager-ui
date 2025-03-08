import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-tracker',
  templateUrl: './vehicle-tracker.component.html',
  styleUrls: ['./vehicle-tracker.component.css']
})
export class VehicleTrackerComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

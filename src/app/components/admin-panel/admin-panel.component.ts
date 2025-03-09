import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="text-center">⚙️ Admin Panel</h2>
      <p class="text-muted text-center">Manage users, settings, and system configurations.</p>
      <div class="card p-4 shadow-lg">
        <h5>Admin Dashboard</h5>
        <p>Welcome, Admin! Here you can control system settings.</p>
      </div>
    </div>
  `,
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {}

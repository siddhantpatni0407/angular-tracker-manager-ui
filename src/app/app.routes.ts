import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MedicalTrackerComponent } from './components/medical-tracker/medical-tracker.component';
import { VehicleTrackerComponent } from './components/vehicle-tracker/vehicle-tracker.component';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard for route protection

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'medical-tracker', component: MedicalTrackerComponent, canActivate: [AuthGuard] },
  { path: 'vehicle-tracker', component: VehicleTrackerComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/login' } // Fallback for unknown routes
];

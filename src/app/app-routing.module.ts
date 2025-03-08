import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Import DashboardComponent
import { AuthGuard } from './guards/auth.guard'; // Import the AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] }, // Ensure this route exists
  { path: '**', redirectTo: '/login' } // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use forRoot for the root routing module
  exports: [RouterModule]
})
export class AppRoutingModule {}
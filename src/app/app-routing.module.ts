import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent }, // ✅ Ensure it is included
  { path: '**', redirectTo: '/login' } // ✅ Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // ✅ Ensure forRoot is used
  exports: [RouterModule]
})
export class AppRoutingModule {}

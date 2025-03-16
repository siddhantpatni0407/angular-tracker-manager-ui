import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MedicalTrackerComponent } from './components/medical-tracker/medical-tracker.component';
import { VehicleTrackerComponent } from './components/vehicle-tracker/vehicle-tracker.component';
import { RegisterVehicleComponent } from './components/vehicle-tracker/register-vehicle/register-vehicle.component';
import { FetchVehicleComponent } from './components/vehicle-tracker/fetch-vehicle/fetch-vehicle.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { UpdateVehicleComponent } from './components/vehicle-tracker/update-vehicle/update-vehicle.component';
import { FuelExpenseComponent } from './components/vehicle-tracker/fuel-expense/fuel-expense.component';
import { AddFuelExpenseComponent } from './components/vehicle-tracker/fuel-expense/add-fuel-expense/add-fuel-expense.component';
import { ViewFuelExpenseComponent } from './components/vehicle-tracker/fuel-expense/view-fuel-expense/view-fuel-expense.component';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard for route protection
import { FuelStatisticsComponent } from './components/vehicle-tracker/fuel-expense/fuel-statistics/fuel-statistics.component';
import { FuelReportsComponent } from './components/vehicle-tracker/fuel-expense/fuel-reports/fuel-reports.component';
import { StockMarketTrackerComponent } from './components/stock-market-tracker/stock-market-tracker.component';
import { NiftyStockDataComponent } from './components/stock-market-tracker/nifty-stock-data/nifty-stock-data.component';
import { ServicingDetailsComponent } from './components/vehicle-tracker/servicing-details/servicing-details.component';
import { AddVehicleServiceComponent } from './components/vehicle-tracker/servicing-details/add-vehicle-service/add-vehicle-service.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'medical-tracker', component: MedicalTrackerComponent, canActivate: [AuthGuard] },
  { path: 'vehicle-tracker', component: VehicleTrackerComponent, canActivate: [AuthGuard] },
  { path: 'stock-market-tracker', component: StockMarketTrackerComponent, canActivate: [AuthGuard] },
  { path: 'nifty-stock-data', component: NiftyStockDataComponent, canActivate: [AuthGuard] },
  { path: 'register-vehicle', component: RegisterVehicleComponent, canActivate: [AuthGuard] },
  { path: 'fetch-vehicle', component: FetchVehicleComponent, canActivate: [AuthGuard] },
  { path: 'update-user/:userId', component: UpdateUserComponent },
  { path: 'update-vehicle', component: UpdateVehicleComponent, canActivate: [AuthGuard] },
  { path: 'fuel-expense', component: FuelExpenseComponent, canActivate: [AuthGuard] },
  { path: 'add-fuel-expense', component: AddFuelExpenseComponent, canActivate: [AuthGuard] },
  { path: 'view-fuel-expense', component: ViewFuelExpenseComponent, canActivate: [AuthGuard] },
  { path: 'fuel-statistics', component: FuelStatisticsComponent, canActivate: [AuthGuard] },
  { path: 'fuel-reports', component: FuelReportsComponent, canActivate: [AuthGuard] },
  { path: 'servicing-details', component: ServicingDetailsComponent, canActivate: [AuthGuard] },
  { path: 'add-vehicle-service', component: AddVehicleServiceComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/login' } // Fallback for unknown routes
];

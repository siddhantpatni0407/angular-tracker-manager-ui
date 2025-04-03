import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { MedicalTrackerComponent } from './components/medical-tracker/medical-tracker.component';
import { VehicleTrackerComponent } from './components/vehicle-tracker/vehicle-tracker.component';
import { RegisterVehicleComponent } from './components/vehicle-tracker/register-vehicle/register-vehicle.component';
import { FetchVehicleComponent } from './components/vehicle-tracker/fetch-vehicle/fetch-vehicle.component';
import { UpdateVehicleComponent } from './components/vehicle-tracker/update-vehicle/update-vehicle.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { FuelExpenseComponent } from './components/vehicle-tracker/fuel-expense/fuel-expense.component';
import { AddFuelExpenseComponent } from './components/vehicle-tracker/fuel-expense/add-fuel-expense/add-fuel-expense.component';
import { ViewFuelExpenseComponent } from './components/vehicle-tracker/fuel-expense/view-fuel-expense/view-fuel-expense.component';
import { FuelStatisticsComponent } from './components/vehicle-tracker/fuel-expense/fuel-statistics/fuel-statistics.component';
import { FuelReportsComponent } from './components/vehicle-tracker/fuel-expense/fuel-reports/fuel-reports.component';
import { StockMarketTrackerComponent } from './components/stock-market-tracker/stock-market-tracker.component';
import { NiftyStockDataComponent } from './components/stock-market-tracker/nifty-stock-data/nifty-stock-data.component';
import { ServicingDetailsComponent } from './components/vehicle-tracker/servicing-details/servicing-details.component';
import { AddVehicleServiceComponent } from './components/vehicle-tracker/servicing-details/add-vehicle-service/add-vehicle-service.component';
import { ViewVehicleServiceComponent } from './components/vehicle-tracker/servicing-details/view-vehicle-service/view-vehicle-service.component';
import { CredentialTrackerComponent } from './components/credential-tracker/credential-tracker.component';
import { AddCredentialsComponent } from './components/credential-tracker/add-credentials/add-credentials.component';
import { FetchCredentialsComponent } from './components/credential-tracker/fetch-credentials/fetch-credentials.component';
import { FinancialTrackerComponent } from './components/financial-tracker/financial-tracker.component';
import { AddBankAccountComponent } from './components/financial-tracker/add-bank-account/add-bank-account.component';
import { ViewBankAccountComponent } from './components/financial-tracker/view-bank-account/view-bank-account.component';
import { ManageCardsComponent } from './components/financial-tracker/manage-cards/manage-cards.component';
import { AddCardComponent } from './components/financial-tracker/manage-cards/add-card/add-card.component';
import { ViewCardComponent } from './components/financial-tracker/manage-cards/view-card/view-card.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
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
  { path: 'update-user', component: UpdateUserComponent, canActivate: [AuthGuard] },
  { path: 'update-vehicle', component: UpdateVehicleComponent, canActivate: [AuthGuard] },
  { path: 'fuel-expense', component: FuelExpenseComponent, canActivate: [AuthGuard] },
  { path: 'add-fuel-expense', component: AddFuelExpenseComponent, canActivate: [AuthGuard] },
  { path: 'view-fuel-expense', component: ViewFuelExpenseComponent, canActivate: [AuthGuard] },
  { path: 'fuel-statistics', component: FuelStatisticsComponent, canActivate: [AuthGuard] },
  { path: 'fuel-reports', component: FuelReportsComponent, canActivate: [AuthGuard] },
  { path: 'servicing-details', component: ServicingDetailsComponent, canActivate: [AuthGuard] },
  { path: 'add-vehicle-service', component: AddVehicleServiceComponent, canActivate: [AuthGuard] },
  { path: 'view-vehicle-service', component: ViewVehicleServiceComponent, canActivate: [AuthGuard] },
  { path: 'credential-tracker', component: CredentialTrackerComponent, canActivate: [AuthGuard] },
  { path: 'add-credentials', component: AddCredentialsComponent, canActivate: [AuthGuard] },
  { path: 'fetch-credentials', component: FetchCredentialsComponent, canActivate: [AuthGuard] },
  { path: 'financial-tracker', component: FinancialTrackerComponent, canActivate: [AuthGuard] },
  { path: 'add-bank-account', component: AddBankAccountComponent, canActivate: [AuthGuard] },
  { path: 'view-bank-account', component: ViewBankAccountComponent, canActivate: [AuthGuard] },
  { path: 'manage-cards', component: ManageCardsComponent, canActivate: [AuthGuard] },
  { path: 'add-card', component: AddCardComponent, canActivate: [AuthGuard] },
  { path: 'view-card', component: ViewCardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    AdminPanelComponent,
    DashboardComponent,
    MedicalTrackerComponent, // Added Medical Tracker component
    VehicleTrackerComponent, // Added Vehicle Tracker component
    StockMarketTrackerComponent,
    NiftyStockDataComponent,
    RegisterVehicleComponent,
    FetchVehicleComponent,
    UpdateUserComponent,
    UpdateVehicleComponent,
    FuelExpenseComponent,
    AddFuelExpenseComponent,
    ViewFuelExpenseComponent,
    FuelStatisticsComponent,
    FuelReportsComponent,
    ServicingDetailsComponent,
    AddVehicleServiceComponent,
    ViewVehicleServiceComponent,
    CredentialTrackerComponent,
    AddCredentialsComponent,
    FetchCredentialsComponent,
    FinancialTrackerComponent,
    AddBankAccountComponent,
    ViewBankAccountComponent,
    ManageCardsComponent,
    AddCardComponent,
    ViewCardComponent,
    ReactiveFormsModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

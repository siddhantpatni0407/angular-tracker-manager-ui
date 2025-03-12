import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { VehicleService } from '../../../../services/vehicle.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { API_URLS } from '../../../../constants/api.constants';

@Component({
  selector: 'app-view-fuel-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-fuel-expense.component.html',
  styleUrls: ['./view-fuel-expense.component.css'],
})
export class ViewFuelExpenseComponent implements OnInit {
  vehicles: any[] = [];
  fuelExpenses: any[] = [];
  filteredExpenses: any[] = [];
  selectedVehicleId: string = '';
  selectedRegistrationNumber: string = '';

  constructor(
    private vehicleService: VehicleService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  // Load Vehicles on Page Load
  loadVehicles(): void {
    this.http.get<any>(API_URLS.FETCH_ALL_VEHICLE_ENDPOINT).subscribe({
      next: (response) => {
        console.log('🚗 Vehicles API Response:', response);
        this.vehicles = response.data || response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  // Update selected vehicle and fetch expenses
  updateSelectedVehicle(): void {
    const selectedVehicle = this.vehicles.find(v => v.vehicleId == this.selectedVehicleId);
    this.selectedRegistrationNumber = selectedVehicle ? selectedVehicle.registrationNumber : '';

    console.log('✅ Selected Vehicle ID:', this.selectedVehicleId);
    console.log('✅ Selected Registration Number:', this.selectedRegistrationNumber);

    this.fetchFuelExpenses();
  }

  // Fetch Fuel Expenses from API
  fetchFuelExpenses(): void {
    if (!this.selectedVehicleId || !this.selectedRegistrationNumber) {
      this.filteredExpenses = [];
      return;
    }

    const url = `${API_URLS.VEHICLE_FUEL_EXPENSE_ENDPOINT}?vehicleId=${this.selectedVehicleId}&registrationNumber=${this.selectedRegistrationNumber}`;
    console.log('🌍 Fetching Fuel Expenses:', url);

    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('📊 Fuel Expenses API Response:', response);
        this.filteredExpenses = response.status === 'SUCCESS' ? response.data : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching fuel expenses:', err);
        this.filteredExpenses = [];
      },
    });
  }

  // Calculate Total Quantity
  getTotalQuantity(): number {
    return this.filteredExpenses.reduce((sum, expense) => sum + (expense.quantity || 0), 0);
  }

  // Calculate Total Amount
  getTotalAmount(): number {
    return this.filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  }

  // Export to Excel
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredExpenses);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fuel Expenses');
    XLSX.writeFile(wb, 'Fuel_Expenses.xlsx');
  }

  // Export to PDF
  exportToPDF(): void {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF.default();
        doc.text('Fuel Expenses Report', 15, 10);

        const tableData = this.filteredExpenses.map((expense, index) => [
          index + 1,
          expense.fuelFilledDate,
          expense.vehicleRegistrationNumber,
          expense.quantity,
          expense.rate,
          expense.amount,
          expense.odometerReading,
          expense.location,
          expense.paymentMode,
        ]);

        (doc as any).autoTable({
          head: [['Sr No.', 'Date', 'Vehicle', 'Quantity', 'Rate', 'Amount', 'Odometer', 'Location', 'Payment Mode']],
          body: tableData,
          startY: 20,
        });

        doc.save('Fuel_Expenses.pdf');
      });
    });
  }

  // Navigate back to Fuel Expense Dashboard
  goBack() {
    this.router.navigate(['/fuel-expense']);
  }
}

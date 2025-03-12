import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { VehicleService } from '../../../../services/vehicle.service';
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

  searchText: string = ''; // ✅ For filtering

  sortColumn: string = ''; // ✅ Column being sorted
  sortDirection: string = 'asc'; // ✅ Sorting order (asc or desc)

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.http.get<any>(API_URLS.FETCH_ALL_VEHICLE_ENDPOINT).subscribe({
      next: (response) => {
        console.log('🚗 Vehicles API Response:', response);
        this.vehicles = response.data || response;
        this.cdr.detectChanges(); // ✅ Force UI update
      },
      error: (err) => console.error('❌ Error loading vehicles:', err),
    });
  }

  // Update selected vehicle and fetch expenses
  updateSelectedVehicle(): void {
    const selectedVehicle = this.vehicles.find(
      (v) => v.vehicleId == this.selectedVehicleId
    );
    this.selectedRegistrationNumber = selectedVehicle
      ? selectedVehicle.registrationNumber
      : '';

    console.log('✅ Selected Vehicle ID:', this.selectedVehicleId);
    console.log(
      '✅ Selected Registration Number:',
      this.selectedRegistrationNumber
    );

    this.fetchFuelExpenses();
  }

  fetchFuelExpenses(): void {
    if (!this.selectedVehicleId || !this.selectedRegistrationNumber) {
      this.filteredExpenses = [];
      return;
    }

    const url = `${API_URLS.VEHICLE_FUEL_EXPENSE_ENDPOINT}?vehicleId=${this.selectedVehicleId}&registrationNumber=${this.selectedRegistrationNumber}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.fuelExpenses = response.status === 'SUCCESS' ? response.data : [];
        this.filterExpenses(); // ✅ Apply filtering on initial data load
      },
      error: () => {
        this.fuelExpenses = [];
        this.filteredExpenses = [];
      },
    });
  }

  // Calculate total quantity and amount
  getTotalQuantity(): string {
    const total = this.filteredExpenses.reduce(
      (sum, expense) => sum + Number(expense.quantity),
      0
    );

    const roundedTotal = Math.round(total * 100) / 100;

    return roundedTotal.toFixed(2);
  }

  getTotalAmount(): string {
    const total = this.filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return total.toFixed(2); // Ensures exactly two decimal places
  }

  sortExpenses(column: string): void {
    if (this.sortColumn === column) {
      // Toggle between ascending and descending order
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredExpenses.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  filterExpenses(): void {
    const searchLower = this.searchText.toLowerCase();

    this.filteredExpenses = this.fuelExpenses.filter(
      (expense) =>
        expense.location?.toLowerCase().includes(searchLower) ||
        expense.paymentMode?.toLowerCase().includes(searchLower) ||
        expense.fuelFilledDate?.toLowerCase().includes(searchLower)
    );
  }

  // ✅ Export Table Data to Excel with Auto Column Widths, Borders & Table Style
  exportToExcel(): void {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0]; // YYYYMMDD_HHMMSS format
    const fileName = `Fuel_Expense_${this.selectedRegistrationNumber}_${formattedDate}.xlsx`;

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredExpenses);

    // ✅ Add Total Row
    const totalRow = {
      fuelFilledDate: 'Total',
      vehicleRegistrationNumber: '',
      quantity: this.getTotalQuantity(),
      rate: '',
      amount: this.getTotalAmount(),
      odometerReading: '',
      location: '',
      paymentMode: '',
    };

    const sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
    sheetData.push(Object.values(totalRow)); // Append Total Row
    const updatedWs = XLSX.utils.aoa_to_sheet(sheetData);

    // ✅ Auto Adjust Column Widths (Fix: Explicitly type `idx` as `number`)
    const colWidths: number[] = sheetData.reduce(
      (acc: number[], row: any[]) => {
        row.forEach((cell: any, idx: number) => {
          acc[idx] = Math.max(acc[idx] || 10, cell?.toString().length + 5); // Adjust width by 5 more than the cell length
        });
        return acc;
      },
      []
    );

    updatedWs['!cols'] = colWidths.map((w: number) => ({ width: w })); // Column width adjustments

    // ✅ Add Borders to All Cells
    const range = XLSX.utils.decode_range(updatedWs['!ref'] || '');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!updatedWs[cellAddress]) continue;
        if (!updatedWs[cellAddress].s) updatedWs[cellAddress].s = {};
        updatedWs[cellAddress].s.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        updatedWs[cellAddress].s.alignment = { horizontal: 'center' }; // Center alignment for all cells
      }
    }

    // Create and append the workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, updatedWs, 'Fuel Expenses');
    XLSX.writeFile(wb, fileName);
  }

  // ✅ Export Table Data to PDF with Full Page Borders & Styled Table
  exportToPDF(): void {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0]; // YYYYMMDD_HHMMSS format
    const fileName = `Fuel_Expense_${this.selectedRegistrationNumber}_${formattedDate}.pdf`;

    const registrationNumber = this.selectedRegistrationNumber; // Use selected registration number
    const headerText = `Fuel Expense - ${registrationNumber}`;

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF.default();

        // Center the header text with registration number
        const pageWidth = doc.internal.pageSize.width;
        const textWidth =
          doc.getStringUnitWidth(headerText) * doc.internal.scaleFactor;
        const xPos = (pageWidth - textWidth) / 2;
        doc.text(headerText, xPos, 10); // Header is centered

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

        // ✅ Append Total Row to PDF Table
        tableData.push([
          '',
          'Total',
          '',
          this.getTotalQuantity(),
          '',
          this.getTotalAmount(),
          '',
          '',
          '',
        ]);

        (autoTable as any).default(doc, {
          head: [
            [
              'Sr No.',
              'Date',
              'Vehicle',
              'Quantity (L)',
              'Rate (₹)',
              'Amount (₹)',
              'Odometer',
              'Location',
              'Payment Mode',
            ],
          ],
          body: tableData,
          startY: 20,
          theme: 'grid', // ✅ Improved Table Styling
          styles: { fontSize: 10 },
          tableLineColor: [0, 0, 0], // ✅ Black Borders
          tableLineWidth: 0.1,
        });

        // ✅ Draw Full Page Border
        doc.setLineWidth(0.5);
        doc.rect(
          5,
          5,
          doc.internal.pageSize.width - 10,
          doc.internal.pageSize.height - 10
        );

        doc.save(fileName);
      });
    });
  }

  // Navigate back to Fuel Expense Dashboard
  goBack() {
    this.router.navigate(['/fuel-expense']);
  }
}

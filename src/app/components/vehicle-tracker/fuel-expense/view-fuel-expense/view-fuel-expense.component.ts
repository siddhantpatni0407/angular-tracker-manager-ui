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

    const sheetData: any[] = [
      [
        {
          v: `Fuel Expense - ${this.selectedRegistrationNumber}`,
          t: 's',
          s: {
            font: { bold: true, sz: 14, color: { rgb: '500050' } },
            alignment: { horizontal: 'center' },
          },
        },
      ],
      [
        {
          v: `Exported Date: ${formattedDate}`,
          t: 's',
          s: { font: { sz: 10 }, alignment: { horizontal: 'right' } },
        },
      ],
      [
        'Date',
        'Vehicle',
        'Quantity (L)',
        'Rate (₹)',
        'Amount (₹)',
        'Odometer',
        'Location',
        'Payment Mode',
      ],
    ];

    this.filteredExpenses.forEach((expense) => {
      sheetData.push([
        expense.fuelFilledDate,
        expense.vehicleRegistrationNumber,
        expense.quantity,
        expense.rate,
        expense.amount,
        expense.odometerReading,
        expense.location,
        expense.paymentMode,
      ]);
    });

    // ✅ Append Total Row (Bold but No Background Highlight)
    sheetData.push([
      'Total',
      '',
      this.getTotalQuantity(),
      '',
      this.getTotalAmount(),
      '',
      '',
      '',
    ]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);

    // ✅ Styling Headers & Total Row
    const range = XLSX.utils.decode_range(ws['!ref'] || '');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue;
        if (!ws[cellAddress].s) ws[cellAddress].s = {};

        ws[cellAddress].s.alignment = { horizontal: 'center' }; // Center align all text
        ws[cellAddress].s.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };

        if (R === 2) {
          ws[cellAddress].s.fill = { fgColor: { rgb: 'BA92D5' } }; // Light Purple Header
          ws[cellAddress].s.font = { bold: true, color: { rgb: 'FFFFFF' } };
        }

        if (R === sheetData.length - 1) {
          ws[cellAddress].s.font = { bold: true };
        }
      }
    }

    // ✅ Auto Adjust Column Widths
    ws['!cols'] = sheetData[2].map((cell: any) => ({
      width: (cell?.toString().length || 10) + 5,
    }));

    // Create and append the workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fuel Expenses');
    XLSX.writeFile(wb, fileName);
  }

  // ✅ Export Table Data to PDF with Full Page Borders & Styled Table
  exportToPDF(): void {
    const currentDate = new Date();
    const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const fileName = `Fuel_Expense_${this.selectedRegistrationNumber}_${formattedDate}.pdf`;

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF.default();
        const pageWidth = doc.internal.pageSize.width;

        // ✅ Header Text (Centered)
        const headerText = `Fuel Expense - ${this.selectedRegistrationNumber}`;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(80, 0, 80); // Dark Purple
        doc.text(headerText, pageWidth / 2, 14, { align: 'center' });

        // ✅ Exported Date (Right-Aligned, But Within Border)
        const exportDateText = `Exported Date : ${formattedDate}`;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(exportDateText, pageWidth - 55, 14); // Adjusted to stay inside border

        // ✅ Header Background Color (Light Purple)
        doc.setFillColor(186, 146, 213); // Light Purple
        doc.rect(10, 18, pageWidth - 20, 10, 'F'); // Header Background

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

        // ✅ Append Total Row (Only Bold, No Background Highlight)
        const totalRow = [
          '',
          'Total',
          '',
          this.getTotalQuantity(),
          '',
          this.getTotalAmount(),
          '',
          '',
          '',
        ];
        tableData.push(totalRow);

        (autoTable as any).default(doc, {
          head: [
            [
              '#',
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
          startY: 30,
          theme: 'grid',
          styles: { fontSize: 10, textColor: 0 },
          headStyles: {
            fillColor: [146, 116, 173], // ✅ Dark Purple Header
            textColor: [255, 255, 255], // ✅ White Text in Header
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 1,
            lineColor: [80, 0, 80], // ✅ Dark Purple Border
          },
          alternateRowStyles: {
            fillColor: [240, 230, 250], // ✅ Light Purple for Alternate Rows
          },
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.5,
          didDrawCell: function (data: any) {
            if (data.row.index === tableData.length - 1) {
              // ✅ Only Bold for "Total" Row, No Background Highlight
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(0, 0, 0);
            }
          },
          didDrawPage: function (data: any) {
            const totalPages = doc.internal.pages.length - 1;

            // ✅ Footer with Page Numbering (Bottom Right)
            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.text(
              `Page ${data.pageNumber} of ${totalPages}`,
              pageWidth - 30,
              doc.internal.pageSize.height - 10
            );

            // ✅ Footer Branding (Bottom Left)
            doc.setFontSize(8);
            doc.setTextColor(80, 0, 80);
            doc.text(
              'Generated by Tracker Manager System',
              10,
              doc.internal.pageSize.height - 10
            );
          },
        });

        // ✅ Square Page Border (Ensuring Export Date Stays Inside)
        doc.setLineWidth(1);
        doc.setDrawColor(100, 100, 100);
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

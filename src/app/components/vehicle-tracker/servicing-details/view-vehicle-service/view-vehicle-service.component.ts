import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { VehicleService } from '../../../../services/vehicle.service';
import { API_URLS } from '../../../../constants/api.constants';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-view-vehicle-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-vehicle-service.component.html',
  styleUrls: ['./view-vehicle-service.component.css'],
})
export class ViewVehicleServiceComponent implements OnInit {
  vehicles: any[] = [];
  vehicleServices: any[] = [];
  filteredServices: any[] = [];
  selectedVehicleId: string = '';
  selectedRegistrationNumber: string = '';

  userId!: number;

  constructor(
    private vehicleService: VehicleService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  searchText: string = '';

  sortColumn: string = '';
  sortDirection: string = 'asc';

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.loadVehicles(this.userId);
  }

  loadVehicles(userId: number): void {
    const url = `${API_URLS.FETCH_VEHICLES_BY_USER_ENDPOINT}?userId=${userId}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.vehicles = response.data || response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading vehicles:', err),
    });
  }

  updateSelectedVehicle(): void {
    const selectedVehicle = this.vehicles.find(
      (v) => v.vehicleId == this.selectedVehicleId
    );
    this.selectedRegistrationNumber = selectedVehicle
      ? selectedVehicle.registrationNumber
      : '';
    this.fetchVehicleServices();
  }

  fetchVehicleServices(): void {
    if (!this.selectedVehicleId || !this.selectedRegistrationNumber) {
      this.filteredServices = [];
      return;
    }

    const url = `${API_URLS.VEHICLE_SERVICING_ENDPOINT}?vehicleId=${this.selectedVehicleId}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.vehicleServices =
          response.status === 'SUCCESS' ? response.data : [];
        this.filterServices();
      },
      error: () => {
        this.vehicleServices = [];
        this.filteredServices = [];
      },
    });
  }

  getTotalServiceCost(): string {
    const total = this.filteredServices.reduce(
      (sum, service) => sum + service.serviceCost,
      0
    );
    return total.toFixed(2);
  }

  sortServices(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredServices.sort((a, b) => {
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

  filterServices(): void {
    const searchLower = this.searchText.toLowerCase();

    this.filteredServices = this.vehicleServices.filter(
      (service) =>
        service.serviceType?.toLowerCase().includes(searchLower) ||
        service.serviceCenter?.toLowerCase().includes(searchLower) ||
        service.serviceDate?.toLowerCase().includes(searchLower)
    );
  }

  getVehicleRegistrationNumber(vehicleId: string): string {
    const vehicle = this.vehicles.find((v) => v.vehicleId === vehicleId);
    return vehicle ? vehicle.registrationNumber : 'Unknown';
  }

  exportToExcel(): void {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0]; // YYYYMMDD_HHMMSS format
    const fileName = `Vehicle_Service_${this.selectedRegistrationNumber}_${formattedDate}.xlsx`;

    const sheetData: any[] = [
      [
        {
          v: `Vehicle Service - ${this.selectedRegistrationNumber}`,
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
        'Service Date',
        'Vehicle',
        'Service Type',
        'Service Cost (₹)',
        'Service Center',
      ],
    ];

    this.filteredServices.forEach((service) => {
      sheetData.push([
        service.serviceDate,
        service.vehicleRegistrationNumber,
        service.serviceType,
        service.serviceCost,
        service.serviceCenter,
      ]);
    });

    // ✅ Append Total Row (Bold but No Background Highlight)
    sheetData.push(['Total', '', '', this.getTotalServiceCost(), '']);

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
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicle Service');
    XLSX.writeFile(wb, fileName);
  }

  exportToPDF(): void {
    const currentDate = new Date();
    const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const fileName = `Vehicle_Service_${this.selectedRegistrationNumber}_${formattedDate}.pdf`;

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF.default();
        const pageWidth = doc.internal.pageSize.width;

        // ✅ Header Text (Centered)
        const headerText = `Vehicle Service - ${this.selectedRegistrationNumber}`;
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

        // Map service data with vehicle registration number
        const tableData = this.filteredServices.map((service, index) => [
          index + 1,
          service.serviceDate,
          this.getVehicleRegistrationNumber(service.vehicleId), // Ensure vehicle registration is fetched correctly
          service.serviceType,
          service.serviceCost,
          service.serviceCenter,
        ]);

        // ✅ Append Total Row (Only Bold, No Background Highlight)
        const totalRow = ['', 'Total', '', '', this.getTotalServiceCost(), ''];
        tableData.push(totalRow);

        (autoTable as any).default(doc, {
          head: [
            [
              '#',
              'Service Date',
              'Vehicle',
              'Service Type',
              'Service Cost (₹)',
              'Service Center',
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

  goBack(): void {
    this.router.navigate(['/servicing-details']);
  }
}

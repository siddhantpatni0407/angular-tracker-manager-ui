import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { API_URLS } from '../../../constants/api.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal for modal functionality

@Component({
  selector: 'app-fetch-credentials',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fetch-credentials.component.html',
  styleUrls: ['./fetch-credentials.component.css'],
})
export class FetchCredentialsComponent implements OnInit {
  credentials: any[] = [];
  filteredCredentials: any[] = [];
  userId!: number; // Non-null assertion operator
  searchText: string = ''; // For filtering
  sortColumn: string = ''; // Column being sorted
  sortDirection: string = 'asc'; // Sorting order (asc or desc)
  selectedCredential: any = null; // To store the selected credential

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal // Inject NgbModal
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId')); // Fetch userId from session storage
    this.fetchCredentials();
  }

  // Fetch credentials from the backend API
  fetchCredentials(): void {
    const url = `${API_URLS.CREDENTIALS_ENDPOINT}?userId=${this.userId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this.credentials = response.data.map((credential: any) => ({
            ...credential,
            showPassword: false, // Add a flag to control password visibility
          }));
          this.filterCredentials(); // Apply filtering on initial data load
        } else {
          this.credentials = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching credentials:', err);
        this.credentials = [];
        this.filteredCredentials = [];
      },
    });
  }

  // Filter credentials based on search text
  filterCredentials(): void {
    const searchLower = this.searchText.toLowerCase();

    this.filteredCredentials = this.credentials.filter(
      (credential) =>
        credential.accountName?.toLowerCase().includes(searchLower) ||
        credential.accountType?.toLowerCase().includes(searchLower) ||
        credential.username?.toLowerCase().includes(searchLower) ||
        credential.email?.toLowerCase().includes(searchLower) ||
        credential.mobileNumber?.toLowerCase().includes(searchLower)
    );
  }

  // Sort credentials by column
  sortCredentials(column: string): void {
    if (this.sortColumn === column) {
      // Toggle between ascending and descending order
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredCredentials.sort((a, b) => {
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

  formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url; // Default to HTTPS if missing
    }
    return url;
  }

  // Toggle password visibility
  togglePasswordVisibility(credential: any): void {
    credential.showPassword = !credential.showPassword;
  }

  // Open credential modal
  openCredentialModal(credential: any, modalTemplate: any): void {
    this.selectedCredential = credential; // Set the selected credential
    this.modalService.open(modalTemplate, { size: 'lg' }); // Open the modal
  }

  // Export credentials to Excel
  exportToExcel(): void {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0]; // YYYYMMDD_HHMMSS format
    const fileName = `Credentials_${formattedDate}.xlsx`;

    const sheetData: any[] = [
      [
        '#',
        'Account Name',
        'Account Type',
        'Website',
        'URL',
        'Username',
        'Email',
        'Mobile Number',
        'Status',
        'Remarks',
        'Password',
      ],
      ...this.filteredCredentials.map((credential, index) => [
        index + 1,
        credential.accountName,
        credential.accountType,
        credential.website,
        credential.url,
        credential.username,
        credential.email,
        credential.mobileNumber,
        credential.status,
        credential.remarks,
        credential.password,
      ]),
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Credentials');
    XLSX.writeFile(wb, fileName);
  }

  // Export credentials to PDF
  exportToPDF(): void {
    const currentDate = new Date();
    const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const fileName = `Credentials_${formattedDate}.pdf`;

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF.default('p', 'mm', 'a4'); // A4 page size
        const pageWidth = doc.internal.pageSize.getWidth(); // Get page width in mm
        const pageHeight = doc.internal.pageSize.getHeight(); // Get page height in mm

        // ✅ Header Text (Centered)
        const headerText = `Credentials Data`;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(80, 0, 80); // Dark Purple
        doc.text(headerText, pageWidth / 2, 14, { align: 'center' });

        // ✅ Exported Date (Right-Aligned, But Within Border)
        const exportDateText = `Exported on ${formattedDate}`;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(exportDateText, pageWidth - 20, 14, { align: 'right' });

        // ✅ Header Background Color (Light Purple)
        doc.setFillColor(186, 146, 213); // Light Purple
        doc.rect(10, 18, pageWidth - 20, 10, 'F'); // Header Background

        // Start Y position for the first table
        let startY = 30; // Adjusted to leave space for header and footer

        // Loop through each credential and create a table for it
        this.filteredCredentials.forEach((credential, index) => {
          // Table Data for Key-Value Pairs
          const tableData = [
            ['Account Name', credential.accountName],
            ['Account Type', credential.accountType],
            ['Website', credential.website],
            ['URL', credential.url],
            ['Username', credential.username],
            ['Email', credential.email],
            ['Mobile Number', credential.mobileNumber],
            ['Status', credential.status],
            ['Remarks', credential.remarks],
            ['Password', credential.password],
          ];

          // AutoTable Configuration for Each Credential
          (autoTable as any).default(doc, {
            head: [['Key', 'Value']], // Two-column header
            body: tableData,
            startY: startY,
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
            columnStyles: {
              0: { cellWidth: 40 }, // Fixed width for Key column
              1: { cellWidth: 'auto' }, // Auto width for Value column
            },
            alternateRowStyles: {
              fillColor: [240, 230, 250], // ✅ Light Purple for Alternate Rows
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
          });

          // Update startY for the next table
          startY = (doc as any).lastAutoTable.finalY + 10; // Add some spacing between tables

          // Add a page break if the next table won't fit on the current page
          if (startY > pageHeight - 20) {
            doc.addPage();
            startY = 20; // Reset startY for the new page
          }
        });

        // ✅ Footer with Page Numbering (Bottom Right)
        const totalPages = doc.internal.pages.length;
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(0);
          doc.text(
            `Page ${i} of ${totalPages}`,
            pageWidth - 20,
            pageHeight - 10,
            { align: 'right' }
          );

          // ✅ Footer Branding (Bottom Left)
          doc.setFontSize(8);
          doc.setTextColor(80, 0, 80);
          doc.text('Generated by Tracker Manager System', 10, pageHeight - 10);
        }

        // Save PDF
        doc.save(fileName);
      });
    });
  }

  // Navigate back to Credential Tracker
  goBack(): void {
    this.router.navigate(['/credential-tracker']);
  }
}

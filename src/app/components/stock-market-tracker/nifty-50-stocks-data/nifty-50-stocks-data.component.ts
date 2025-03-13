import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { API_URLS } from '../../../constants/api.constants';

@Component({
  selector: 'app-nifty-50-stocks-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nifty-50-stocks-data.component.html',
  styleUrls: ['./nifty-50-stocks-data.component.css'],
})
export class Nifty50StocksDataComponent implements OnInit {
  stocks: any[] = [];
  filteredStocks: any[] = [];
  filterText: string = '';
  isLoading = false;
  sortColumn: string = '';
  sortDirection: boolean = true;
  private apiUrl = API_URLS.STOCK_MARKET_NIFTY_DATA_ENDPOINT;

  constructor(private http: HttpClient, private router: Router) {
    // Detects navigation back to this component and refreshes data
    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        event.url.includes('/nifty-50-data')
      ) {
        this.fetchStockData();
      }
    });
  }

  ngOnInit(): void {
    this.fetchStockData();
  }

  fetchStockData(): void {
    this.isLoading = true;

    // Append a timestamp to the API URL to prevent caching
    const params = new HttpParams()
      .set('index', 'NIFTY 50')
      .set('timestamp', Date.now().toString()); // Prevent browser caching

    this.http.get<any>(this.apiUrl, { params }).subscribe(
      (response) => {
        console.log('Backend Response:', response);
        if (response?.data?.data?.length) {
          this.stocks = response.data.data.map((stock: any) => ({
            priority: stock.priority || 0,
            symbol: stock.symbol,
            series: stock.series ?? 'N/A',
            open: stock.open,
            previousClose: stock.previousClose,
            yearHigh: stock.yearHigh,
            yearLow: stock.yearLow,
            dayHigh: stock.dayHigh,
            dayLow: stock.dayLow,
            lastPrice: stock.lastPrice,
            lastUpdateTime: stock.lastUpdateTime,
            chartTodayPath: stock.chartTodayPath || 'assets/default-chart.png',
          }));
          this.applyFilter();
        } else {
          console.warn('No stock data available.');
          this.stocks = [];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching stock data:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilter(): void {
    this.filteredStocks = this.stocks.filter((stock) =>
      stock.symbol.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = true;
    }
    this.filteredStocks.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];
      return (valA > valB ? 1 : -1) * (this.sortDirection ? 1 : -1);
    });
  }

  exportToExcel(): void {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0]; // YYYYMMDD_HHMMSS format
    const fileName = `Nifty_50_Stock_Data_${formattedDate}.xlsx`;

    const sheetData: any[] = [
      [
        {
          v: 'NIFTY 50 Stock Data',
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
        '#',
        'Symbol',
        'Open',
        'Previous Close',
        'Year High',
        'Year Low',
        'High',
        'Low',
        'Last Price',
        'Last Update',
      ],
    ];

    this.filteredStocks.forEach((stock, index) => {
      sheetData.push([
        index + 1,
        stock.symbol,
        stock.open,
        stock.previousClose,
        stock.yearHigh,
        stock.yearLow,
        stock.dayHigh,
        stock.dayLow,
        stock.lastPrice,
        stock.lastUpdateTime,
      ]);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Styling Headers
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
      }
    }

    // Auto Adjust Column Widths
    ws['!cols'] = sheetData[2].map((cell: any) => ({
      width: (cell?.toString().length || 10) + 5,
    }));

    // Create and append the workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NIFTY 50 Data');
    XLSX.writeFile(wb, fileName);
  }

  exportToPDF(): void {
    const currentDate = new Date();
    const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const fileName = `Nifty_50_Stock_Data_${formattedDate}.pdf`;

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF.default();
        const pageWidth = doc.internal.pageSize.width;

        // Header Text (Centered)
        const headerText = 'NIFTY 50 Stock Data';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(80, 0, 80); // Dark Purple
        doc.text(headerText, pageWidth / 2, 14, { align: 'center' });

        // Exported Date (Right-Aligned, But Within Border)
        const exportDateText = `Exported Date : ${formattedDate}`;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(exportDateText, pageWidth - 55, 14); // Adjusted to stay inside border

        // Header Background Color (Light Purple)
        doc.setFillColor(186, 146, 213); // Light Purple
        doc.rect(10, 18, pageWidth - 20, 10, 'F'); // Header Background

        const tableData = this.filteredStocks.map((stock, index) => [
          index + 1,
          stock.symbol,
          stock.open,
          stock.previousClose,
          stock.yearHigh,
          stock.yearLow,
          stock.dayHigh,
          stock.dayLow,
          stock.lastPrice,
          stock.lastUpdateTime,
        ]);

        (autoTable as any).default(doc, {
          head: [
            [
              '#',
              'Symbol',
              'Open',
              'Previous Close',
              'Year High',
              'Year Low',
              'High',
              'Low',
              'Last Price',
              'Last Update',
            ],
          ],
          body: tableData,
          startY: 30,
          theme: 'grid',
          styles: { fontSize: 10, textColor: 0 },
          headStyles: {
            fillColor: [146, 116, 173], // Dark Purple Header
            textColor: [255, 255, 255], // White Text in Header
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 1,
            lineColor: [80, 0, 80], // Dark Purple Border
          },
          alternateRowStyles: {
            fillColor: [240, 230, 250], // Light Purple for Alternate Rows
          },
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.5,
          didDrawPage: function (data: any) {
            const totalPages = doc.internal.pages.length - 1;

            // Footer with Page Numbering (Bottom Right)
            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.text(
              `Page ${data.pageNumber} of ${totalPages}`,
              pageWidth - 30,
              doc.internal.pageSize.height - 10
            );

            // Footer Branding (Bottom Left)
            doc.setFontSize(8);
            doc.setTextColor(80, 0, 80);
            doc.text(
              'Generated by Tracker Manager System',
              10,
              doc.internal.pageSize.height - 10
            );
          },
        });

        // Square Page Border (Ensuring Export Date Stays Inside)
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

  goToStockMarketTracker() {
    this.router.navigate(['/stock-market-tracker']);
  }
}

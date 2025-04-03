import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { API_URLS } from '../../../../constants/api.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css'],
})
export class ViewCardComponent implements OnInit {
  bankAccounts: any[] = [];
  bankCards: any[] = [];
  filteredCards: any[] = [];
  selectedAccountId: number | null = null;
  selectedCard: any = null;
  sortColumn: string = '';
  sortDirection: string = 'asc';
  searchText: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  userId!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.loadBankAccounts(this.userId);
  }

  loadBankAccounts(userId: number): void {
    const url = `${API_URLS.FETCH_BANK_ACCOUNT_BY_USER_ENDPOINT}?userId=${userId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('🏦 Bank Accounts API Response:', response);
        this.bankAccounts = response.data || response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error loading bank accounts:', err),
    });
  }

  updateSelectedAccount(): void {
    if (this.selectedAccountId) {
      this.fetchBankCards();
    } else {
      this.filteredCards = [];
    }
  }

  fetchBankCards() {
    if (!this.selectedAccountId) {
      this.errorMessage = 'Please select a bank account';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const url = `${API_URLS.BANK_CARD_BY_BANK_ID_ENDPOINT}?accountId=${this.selectedAccountId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'SUCCESS') {
          this.bankCards = response.data.map((card: any) => ({
            ...card,
            showFullNumber: false,
            showCvv: false,
            showPin: false,
          }));
          this.filteredCards = [...this.bankCards];
        } else {
          this.errorMessage =
            response.message || 'No cards found for this account';
          this.bankCards = [];
          this.filteredCards = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching bank cards:', err);
        this.errorMessage = 'Failed to fetch bank cards. Please try again.';
        this.bankCards = [];
        this.filteredCards = [];
      },
    });
  }

  filterCards(): void {
    const searchLower = this.searchText.toLowerCase();
    this.filteredCards = this.bankCards.filter(
      (card) =>
        card.cardType?.toLowerCase().includes(searchLower) ||
        card.cardNetwork?.toLowerCase().includes(searchLower) ||
        card.cardHolderName?.toLowerCase().includes(searchLower)
    );
  }

  sortCards(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredCards.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      // Handle numeric values
      if (column === 'creditLimit' || column === 'availableCredit') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Handle dates
      if (column === 'validThruDate') {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return this.sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Handle strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Component properties
  isCardFlipped = false;

  // Component methods
  flipCard(): void {
    this.isCardFlipped = !this.isCardFlipped;
  }

  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) return '';
    // Format as XXXX XXXX XXXX XXXX
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  toggleCardNumberVisibility(card: any) {
    card.showFullNumber = !card.showFullNumber;
  }

  toggleCvvVisibility(card: any) {
    card.showCvv = !card.showCvv;
  }

  togglePinVisibility(card: any) {
    card.showPin = !card.showPin;
  }

  openCardModal(card: any, modalTemplate: any) {
    this.selectedCard = card;
    this.modalService.open(modalTemplate, { size: 'lg' });
  }

  editCard(cardId: number) {
    this.router.navigate(['/edit-bank-card', cardId]);
  }

  deleteCard(cardId: number) {
    if (confirm('Are you sure you want to delete this card?')) {
      const url = `${API_URLS.BANK_CARD_ENDPOINT}/${cardId}`;
      this.http.delete(url).subscribe({
        next: () => {
          this.fetchBankCards(); // Refresh the list
        },
        error: (err) => {
          console.error('Error deleting card:', err);
        },
      });
    }
  }

  exportToExcel() {
    if (!this.selectedAccountId) {
      alert('Please select a bank account first');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0];
    const fileName = `BankCards_Account_${this.selectedAccountId}_${formattedDate}.xlsx`;

    const sheetData: any[] = [
      [
        {
          v: `Bank Cards - Account ${this.selectedAccountId}`,
          t: 's',
          s: { font: { bold: true, sz: 14 } },
        },
      ],
      [
        {
          v: `Exported on ${new Date().toLocaleString()}`,
          t: 's',
          s: { font: { sz: 10 } },
        },
      ],
      [
        '#',
        'Card Type',
        'Card Network',
        'Card Holder',
        'Card Number',
        'Expiry Date',
        'Credit Limit',
        'Available Credit',
        'Status',
        'Contactless',
        'Virtual',
        'Remarks',
      ],
      ...this.filteredCards.map((card, index) => [
        index + 1,
        card.cardType,
        card.cardNetwork,
        card.cardHolderName,
        card.showFullNumber
          ? card.cardNumber
          : `•••• •••• •••• ${card.lastFourDigits}`,
        new Date(card.validThruDate).toLocaleDateString('en-US', {
          month: '2-digit',
          year: 'numeric',
        }),
        card.creditLimit,
        card.availableCredit,
        card.cardStatus,
        card.isContactless ? 'Yes' : 'No',
        card.isVirtual ? 'Yes' : 'No',
        card.remarks || 'N/A',
      ]),
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bank Cards');
    XLSX.writeFile(wb, fileName);
  }

  exportToPDF() {
    if (!this.selectedAccountId) {
      alert('Please select a bank account first');
      return;
    }

    const currentDate = new Date();
    const formattedDate = new Date().toISOString().split('T')[0];
    const fileName = `BankCards_Account_${this.selectedAccountId}_${formattedDate}.pdf`;

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF.default('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header
        const headerText = `Bank Cards for Account ${this.selectedAccountId}`;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(80, 0, 80);
        doc.text(headerText, pageWidth / 2, 14, { align: 'center' });

        // Exported Date
        const exportDateText = `Exported on ${new Date().toLocaleString()}`;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(exportDateText, pageWidth - 20, 14, { align: 'right' });

        // Table Data
        const tableData = this.filteredCards.map((card) => [
          card.cardType,
          card.cardNetwork,
          card.cardHolderName,
          card.showFullNumber
            ? card.cardNumber
            : `•••• •••• •••• ${card.lastFourDigits}`,
          new Date(card.validThruDate).toLocaleDateString('en-US', {
            month: '2-digit',
            year: 'numeric',
          }),
          `$${card.creditLimit.toFixed(2)}`,
          `$${card.availableCredit.toFixed(2)}`,
          card.cardStatus,
          card.isContactless ? 'Yes' : 'No',
          card.isVirtual ? 'Yes' : 'No',
          card.remarks || 'N/A',
        ]);

        // AutoTable Configuration
        (autoTable as any).default(doc, {
          head: [
            [
              'Card Type',
              'Network',
              'Holder',
              'Number',
              'Expiry',
              'Credit Limit',
              'Available',
              'Status',
              'Contactless',
              'Virtual',
              'Remarks',
            ],
          ],
          body: tableData,
          startY: 30,
          theme: 'grid',
          styles: { fontSize: 8, textColor: 0 },
          headStyles: {
            fillColor: [146, 116, 173],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 15 },
            2: { cellWidth: 20 },
            3: { cellWidth: 25 },
            4: { cellWidth: 15 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 },
            7: { cellWidth: 15 },
            8: { cellWidth: 15 },
            9: { cellWidth: 15 },
            10: { cellWidth: 'auto' },
          },
          alternateRowStyles: {
            fillColor: [240, 230, 250],
          },
        });

        // Footer with Page Numbering
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
          doc.setFontSize(8);
          doc.setTextColor(80, 0, 80);
          doc.text('Generated by Tracker Manager System', 10, pageHeight - 10);
        }

        doc.save(fileName);
      });
    });
  }

  goToManageCards() {
    this.router.navigate(['/manage-cards']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-nifty-50-stocks-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nifty-50-stocks-data.component.html',
  styleUrls: ['./nifty-50-stocks-data.component.css']
})
export class Nifty50StocksDataComponent implements OnInit {
  stocks: any[] = [];
  filteredStocks: any[] = [];
  filterText: string = '';
  isLoading = false;
  sortColumn: string = '';
  sortDirection: boolean = true;

  private apiUrl = 'http://localhost:8069/api/v1/tracker-manager-service/stock/nifty-50-data';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStockData();
  }

  fetchStockData(): void {
    this.isLoading = true;
    const params = new HttpParams().set('index', 'NIFTY 50');

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
            pChange: stock.pchange ?? 0,
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
    this.filteredStocks = this.stocks.filter(stock =>
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
}
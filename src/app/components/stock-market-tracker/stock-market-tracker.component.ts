import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-market-tracker',
  templateUrl: './stock-market-tracker.component.html',
  styleUrls: ['./stock-market-tracker.component.css']
})
export class StockMarketTrackerComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewNifty50Data() {
    this.router.navigate(['/nifty-50-data']);
  }
}
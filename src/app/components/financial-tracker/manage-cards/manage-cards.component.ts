import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-manager',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.css'],
})
export class ManageCardsComponent {
  constructor(private router: Router) {}

  navigateToFinancialTracker() {
    this.router.navigate(['/financial-tracker']);
  }

  addNewCard() {
    this.router.navigate(['add-card']);
  }

  viewCards() {
    this.router.navigate(['view-card']);
  }
}

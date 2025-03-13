import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMarketTrackerComponent } from './stock-market-tracker.component';

describe('StockMarketTrackerComponent', () => {
  let component: StockMarketTrackerComponent;
  let fixture: ComponentFixture<StockMarketTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMarketTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMarketTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

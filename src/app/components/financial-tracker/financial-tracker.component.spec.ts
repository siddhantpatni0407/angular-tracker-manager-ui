import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTrackerComponent } from './financial-tracker.component';

describe('FinancialTrackerComponent', () => {
  let component: FinancialTrackerComponent;
  let fixture: ComponentFixture<FinancialTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

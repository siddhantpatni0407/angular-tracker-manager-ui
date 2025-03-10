import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFuelExpenseComponent } from './view-fuel-expense.component';

describe('ViewFuelExpenseComponent', () => {
  let component: ViewFuelExpenseComponent;
  let fixture: ComponentFixture<ViewFuelExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFuelExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFuelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

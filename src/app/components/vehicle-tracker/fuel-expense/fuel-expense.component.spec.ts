import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelExpenseComponent } from './fuel-expense.component';

describe('FuelExpenseComponent', () => {
  let component: FuelExpenseComponent;
  let fixture: ComponentFixture<FuelExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

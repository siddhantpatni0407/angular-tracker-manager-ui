import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelExpenseComponent } from './add-fuel-expense.component';

describe('AddFuelExpenseComponent', () => {
  let component: AddFuelExpenseComponent;
  let fixture: ComponentFixture<AddFuelExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFuelExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFuelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

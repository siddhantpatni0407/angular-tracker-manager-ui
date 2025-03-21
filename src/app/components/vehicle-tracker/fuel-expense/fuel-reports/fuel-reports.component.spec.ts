import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelReportsComponent } from './fuel-reports.component';

describe('FuelReportsComponent', () => {
  let component: FuelReportsComponent;
  let fixture: ComponentFixture<FuelReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

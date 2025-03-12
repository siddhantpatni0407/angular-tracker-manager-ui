import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStatisticsComponent } from './fuel-statistics.component';

describe('FuelStatisticsComponent', () => {
  let component: FuelStatisticsComponent;
  let fixture: ComponentFixture<FuelStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

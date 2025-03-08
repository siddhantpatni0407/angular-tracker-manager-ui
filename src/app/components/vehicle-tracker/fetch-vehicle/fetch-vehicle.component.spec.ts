import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchVehicleComponent } from './fetch-vehicle.component';

describe('FetchVehicleComponent', () => {
  let component: FetchVehicleComponent;
  let fixture: ComponentFixture<FetchVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FetchVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetchVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

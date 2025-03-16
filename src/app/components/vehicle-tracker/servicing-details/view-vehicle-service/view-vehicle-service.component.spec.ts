import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVehicleServiceComponent } from './view-vehicle-service.component';

describe('ViewVehicleServiceComponent', () => {
  let component: ViewVehicleServiceComponent;
  let fixture: ComponentFixture<ViewVehicleServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVehicleServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVehicleServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

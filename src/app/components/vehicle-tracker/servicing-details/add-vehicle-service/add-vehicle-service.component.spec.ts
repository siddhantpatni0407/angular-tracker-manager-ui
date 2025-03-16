import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleServiceComponent } from './add-vehicle-service.component';

describe('AddVehicleServiceComponent', () => {
  let component: AddVehicleServiceComponent;
  let fixture: ComponentFixture<AddVehicleServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVehicleServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

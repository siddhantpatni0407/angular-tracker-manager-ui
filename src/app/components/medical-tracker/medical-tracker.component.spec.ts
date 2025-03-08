import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalTrackerComponent } from './medical-tracker.component';

describe('MedicalTrackerComponent', () => {
  let component: MedicalTrackerComponent;
  let fixture: ComponentFixture<MedicalTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

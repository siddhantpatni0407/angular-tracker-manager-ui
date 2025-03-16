import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicingDetailsComponent } from './servicing-details.component';

describe('ServicingDetailsComponent', () => {
  let component: ServicingDetailsComponent;
  let fixture: ComponentFixture<ServicingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

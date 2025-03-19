import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchCredentialsComponent } from './fetch-credentials.component';

describe('FetchCredentialsComponent', () => {
  let component: FetchCredentialsComponent;
  let fixture: ComponentFixture<FetchCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FetchCredentialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetchCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

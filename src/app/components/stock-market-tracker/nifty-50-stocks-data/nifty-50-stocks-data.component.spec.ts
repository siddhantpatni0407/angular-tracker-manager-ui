import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nifty50StocksDataComponent } from './nifty-50-stocks-data.component';

describe('Nifty50StocksDataComponent', () => {
  let component: Nifty50StocksDataComponent;
  let fixture: ComponentFixture<Nifty50StocksDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nifty50StocksDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nifty50StocksDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

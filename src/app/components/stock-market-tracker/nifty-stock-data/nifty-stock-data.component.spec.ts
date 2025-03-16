import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiftyStockDataComponent } from './nifty-stock-data.component';

describe('Nifty50StocksDataComponent', () => {
  let component: NiftyStockDataComponent;
  let fixture: ComponentFixture<NiftyStockDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NiftyStockDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NiftyStockDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

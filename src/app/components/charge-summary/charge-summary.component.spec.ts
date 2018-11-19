import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeSummaryComponent } from './charge-summary.component';

describe('ChargeSummaryComponent', () => {
  let component: ChargeSummaryComponent;
  let fixture: ComponentFixture<ChargeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

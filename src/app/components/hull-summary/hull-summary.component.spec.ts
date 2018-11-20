import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HullSummaryComponent } from './hull-summary.component';

describe('HullSummaryComponent', () => {
  let component: HullSummaryComponent;
  let fixture: ComponentFixture<HullSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HullSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HullSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

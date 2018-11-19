import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceSummaryComponent } from './force-summary.component';

describe('ForceSummaryComponent', () => {
  let component: ForceSummaryComponent;
  let fixture: ComponentFixture<ForceSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

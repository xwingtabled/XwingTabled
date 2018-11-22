import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionSummaryComponent } from './condition-summary.component';

describe('ConditionSummaryComponent', () => {
  let component: ConditionSummaryComponent;
  let fixture: ComponentFixture<ConditionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

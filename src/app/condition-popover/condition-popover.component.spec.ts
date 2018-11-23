import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionPopoverComponent } from './condition-popover.component';

describe('ConditionPopoverComponent', () => {
  let component: ConditionPopoverComponent;
  let fixture: ComponentFixture<ConditionPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

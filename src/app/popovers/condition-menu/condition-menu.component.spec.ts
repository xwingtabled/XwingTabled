import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionMenuComponent } from './condition-menu.component';

describe('ConditionMenuComponent', () => {
  let component: ConditionMenuComponent;
  let fixture: ComponentFixture<ConditionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

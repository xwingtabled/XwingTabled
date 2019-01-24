import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignIdPopoverComponent } from './assign-id-popover.component';

describe('AssignIdPopoverComponent', () => {
  let component: AssignIdPopoverComponent;
  let fixture: ComponentFixture<AssignIdPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignIdPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignIdPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

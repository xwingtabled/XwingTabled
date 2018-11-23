import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotActionsComponent } from '../pilot-actions/pilot-actions.component';

describe('PilotActionsComponent', () => {
  let component: PilotActionsComponent;
  let fixture: ComponentFixture<PilotActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

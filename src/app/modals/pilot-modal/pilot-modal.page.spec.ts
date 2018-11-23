import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotModalPage } from './pilot-modal.page';

describe('PilotModalPage', () => {
  let component: PilotModalPage;
  let fixture: ComponentFixture<PilotModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

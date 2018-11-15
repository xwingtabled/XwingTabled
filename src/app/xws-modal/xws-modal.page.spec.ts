import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XwsModalPage } from './xws-modal.page';

describe('XwsModalPage', () => {
  let component: XwsModalPage;
  let fixture: ComponentFixture<XwsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XwsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XwsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

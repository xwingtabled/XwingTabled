import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeModalPage } from './upgrade-modal.page';

describe('UpgradeModalPage', () => {
  let component: UpgradeModalPage;
  let fixture: ComponentFixture<UpgradeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

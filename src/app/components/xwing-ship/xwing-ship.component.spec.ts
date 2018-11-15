import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XwingShipComponent } from './xwing-ship.component';

describe('XwingIconComponent', () => {
  let component: XwingShipComponent;
  let fixture: ComponentFixture<XwingShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XwingShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XwingShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

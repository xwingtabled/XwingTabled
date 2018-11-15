import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XwingIconComponent } from './xwing-icon.component';

describe('XwingIconComponent', () => {
  let component: XwingIconComponent;
  let fixture: ComponentFixture<XwingIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XwingIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XwingIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mangle names', () => {
    expect(XwingIconComponent.mangle("Critical Hit")).toEqual("crit");
    expect(XwingIconComponent.mangle("Bank Left")).toEqual("bankleft");
  });
});

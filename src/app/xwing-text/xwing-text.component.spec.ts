import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XwingTextComponent } from './xwing-text.component';

describe('XwingTextComponent', () => {
  let component: XwingTextComponent;
  let fixture: ComponentFixture<XwingTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XwingTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XwingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

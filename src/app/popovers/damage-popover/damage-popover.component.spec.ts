import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagePopoverComponent } from './damage-popover.component';

describe('DamagePopoverComponent', () => {
  let component: DamagePopoverComponent;
  let fixture: ComponentFixture<DamagePopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamagePopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamagePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

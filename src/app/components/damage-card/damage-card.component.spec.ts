import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageCardComponent } from './damage-card.component';

describe('DamageCardComponent', () => {
  let component: DamageCardComponent;
  let fixture: ComponentFixture<DamageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

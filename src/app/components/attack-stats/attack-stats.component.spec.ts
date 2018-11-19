import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackStatsComponent } from './attack-stats.component';

describe('AttackStatsComponent', () => {
  let component: AttackStatsComponent;
  let fixture: ComponentFixture<AttackStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttackStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

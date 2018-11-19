import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusStatsComponent } from './bonus-stats.component';

describe('BonusStatsComponent', () => {
  let component: BonusStatsComponent;
  let fixture: ComponentFixture<BonusStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

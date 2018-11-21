import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageSummaryComponent } from './damage-summary.component';

describe('DamageSummaryComponent', () => {
  let component: DamageSummaryComponent;
  let fixture: ComponentFixture<DamageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShieldSummaryComponent } from './shield-summary.component';

describe('ShieldSummaryComponent', () => {
  let component: ShieldSummaryComponent;
  let fixture: ComponentFixture<ShieldSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShieldSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShieldSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementChartComponent } from './movement-chart.component';

describe('MovementChartComponent', () => {
  let component: MovementChartComponent;
  let fixture: ComponentFixture<MovementChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

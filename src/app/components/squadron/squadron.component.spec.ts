import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronComponent } from './squadron.component';

describe('SquadronComponent', () => {
  let component: SquadronComponent;
  let fixture: ComponentFixture<SquadronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

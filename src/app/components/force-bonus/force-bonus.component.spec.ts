import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceBonusComponent } from './force-bonus.component';

describe('ForceBonusComponent', () => {
  let component: ForceBonusComponent;
  let fixture: ComponentFixture<ForceBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

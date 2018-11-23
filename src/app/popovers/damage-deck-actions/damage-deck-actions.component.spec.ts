import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageDeckActionsComponent } from './damage-deck-actions.component';

describe('DamageDeckActionsComponent', () => {
  let component: DamageDeckActionsComponent;
  let fixture: ComponentFixture<DamageDeckActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageDeckActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageDeckActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

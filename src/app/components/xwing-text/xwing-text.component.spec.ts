import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XwingTextComponent } from './xwing-text.component';

describe('XwingTextComponent', () => {
  let component: XwingTextComponent;
  let fixture: ComponentFixture<XwingTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XwingTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XwingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should strip [Brackets]', () => {
    expect(component.stripBrackets('[Hit]')).toEqual('Hit');
  });

  it('should replace [# [Noun]] with # [Noun]', () => {
    expect(component.stripNumberBrackets('Card has [2 [Bank Left]] and [2 [Bank Right]]')).toEqual(
      "Card has 2 [Bank Left] and 2 [Bank Right]"
    );
  });

  it('should mangle text to icons', () => {
    expect(component.mangle('[Hit] [Hit]')).toEqual(
      "<i class='xwing-miniatures-font xwing-miniatures-font-hit'></i> <i class='xwing-miniatures-font xwing-miniatures-font-hit'></i>"
    );
    expect(component.mangle('2 [Hit]')).toEqual(
      "2 <i class='xwing-miniatures-font xwing-miniatures-font-hit'></i>" 
    );
  });
});

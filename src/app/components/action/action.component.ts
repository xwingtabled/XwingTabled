import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() action;

  css_class: string = "difficulty-white";

  constructor() { }

  ngOnInit() {
    this.css_class = "difficulty-" + this.action.difficulty.toLowerCase();
  }

}

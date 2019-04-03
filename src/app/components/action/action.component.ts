import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() action;

  constructor() { }

  getActionClass() {
    return "action " + (this.action.linked ? "action-linked" : "");
  }

  getDifficultyClass() {
    return "difficulty-" + this.action.difficulty.toLowerCase();
  }

  ngOnInit() {
  }

}

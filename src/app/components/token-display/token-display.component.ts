import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xws-token-display',
  templateUrl: './token-display.component.html',
  styleUrls: ['./token-display.component.scss']
})
export class TokenDisplayComponent implements OnInit {
  @Input() name: string;
  @Input() data: any = { };
  @Output() change = new EventEmitter();

  spent = [];
  available = [];
  recovers = [];

  constructor() { }

  makeTokens() {
    this.available = new Array(this.data.remaining);
    this.spent = new Array(this.data.value - this.data.remaining);
    this.change.emit(this.data);
  }

  spend() {
    this.data.remaining -= 1;
    this.makeTokens();
  }

  recover() {
    this.data.remaining += 1;
    this.makeTokens();
  }

  recoverRecurring() {
    this.data.remaining += this.data.recovers;
    if (this.data.remaining > this.data.value) {
      this.data.remaining = this.data.value;
    }
    this.makeTokens();
  }

  ngOnInit() {
    this.makeTokens();
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-token-display',
  templateUrl: './token-display.component.html',
  styleUrls: ['./token-display.component.scss']
})
export class TokenDisplayComponent implements OnInit {
  @Input() name: string;
  @Input() data: any = { };

  spent = [];
  available = [];
  recovers = [];

  constructor() { }

  makeTokens() {
    this.available = new Array(this.data.remaining);
    this.spent = new Array(this.data.value - this.data.remaining);
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
    if (this.data.recovers) {
      this.recovers = new Array(this.data.recovers);
    }
    this.makeTokens();
  }

}

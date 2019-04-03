import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xws-token-display',
  templateUrl: './token-display.component.html',
  styleUrls: ['./token-display.component.scss']
})
export class TokenDisplayComponent implements OnInit {
  @Input() name: string;
  @Input() remaining: number;
  @Input() maximum: number;
  @Output() change = new EventEmitter<any>();

  constructor() { }

  emit() {
    this.change.emit(this.remaining);
  }

  spent() {
    return new Array(this.maximum - this.remaining);
  }

  available() {
    return new Array(this.remaining);
  }

  spend() {
    this.remaining -= 1;
    this.emit();
  }

  recover() {
    this.remaining += 1;
    this.emit();
  }

  ngOnInit() {
  }
}

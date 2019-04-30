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
  @Input() readonly: boolean = false;
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
    if (this.readonly) {
      return;
    }
    this.remaining -= 1;
    this.emit();
  }

  recover() {
    if (this.readonly) {
      return;
    }
    this.remaining += 1;
    this.emit();
  }

  ngOnInit() {
  }
}

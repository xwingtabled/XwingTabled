import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xws-token-display',
  templateUrl: './token-display.component.html',
  styleUrls: ['./token-display.component.scss']
})
export class TokenDisplayComponent implements OnInit {
  @Input() name: string;
  @Input() data: any = { };
  @Output() change = new EventEmitter<any>();

  constructor() { }

  emit() {
    this.change.emit(this.data);
  }

  spent() {
    return new Array(this.data.value - this.data.remaining);
  }

  available() {
    return new Array(this.data.remaining);
  }

  spend() {
    this.data.remaining -= 1;
    this.emit();
  }

  recover() {
    this.data.remaining += 1;
    this.emit();
  }

  ngOnInit() {
  }
}

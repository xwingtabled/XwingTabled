import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-charge-summary',
  templateUrl: './charge-summary.component.html',
  styleUrls: ['./charge-summary.component.scss']
})
export class ChargeSummaryComponent implements OnInit {
  @Input()charges: any;

  constructor() { }

  ngOnInit() {
    if (this.charges.remaining == undefined) {
      this.charges.remaining = this.charges.value;
      this.charges.numbers = Array(this.charges.recovers);
    }
  }

}

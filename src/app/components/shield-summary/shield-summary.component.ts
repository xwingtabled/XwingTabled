import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-shield-summary',
  templateUrl: './shield-summary.component.html',
  styleUrls: ['./shield-summary.component.scss']
})
export class ShieldSummaryComponent implements OnInit {
  @Input() shields: any = { };
  constructor() { }

  ngOnInit() {
    if (this.shields.remaining == undefined) {
      this.shields.remaining = this.shields.value;
    }
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-hull-summary',
  templateUrl: './hull-summary.component.html',
  styleUrls: ['./hull-summary.component.scss']
})
export class HullSummaryComponent implements OnInit {
  @Input() hull: any = { }
  constructor() { }

  ngOnInit() {
    if (this.hull.remaining == undefined) {
      this.hull.remaining = this.hull.value;
    }
  }

}

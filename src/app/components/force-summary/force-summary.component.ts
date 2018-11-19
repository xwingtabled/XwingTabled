import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-force-summary',
  templateUrl: './force-summary.component.html',
  styleUrls: ['./force-summary.component.scss']
})
export class ForceSummaryComponent implements OnInit {

  @Input() force: any = { };
  constructor() { }

  ngOnInit() {
    this.force.numbers = Array(this.force.recovers);
  }

}

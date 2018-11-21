import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-damage-summary',
  templateUrl: './damage-summary.component.html',
  styleUrls: ['./damage-summary.component.scss']
})
export class DamageSummaryComponent implements OnInit {
  @Input() damagecards: any[];
  @Input() squadron: any;

  constructor() { }

  ngOnInit() {
  }

}

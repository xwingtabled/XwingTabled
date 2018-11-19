import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-bonus-stats',
  templateUrl: './bonus-stats.component.html',
  styleUrls: ['./bonus-stats.component.scss']
})
export class BonusStatsComponent implements OnInit {

  @Input() grant: any = { };

  constructor() { }

  ngOnInit() {
  }

}

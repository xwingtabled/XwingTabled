import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-attack-stats',
  templateUrl: './attack-stats.component.html',
  styleUrls: ['./attack-stats.component.scss']
})
export class AttackStatsComponent implements OnInit {
  @Input() attack: any;
  constructor() { }

  ngOnInit() {
  }

}

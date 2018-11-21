import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-damage-card',
  templateUrl: './damage-card.component.html',
  styleUrls: ['./damage-card.component.scss']
})
export class DamageCardComponent implements OnInit {
  @Input() card: any = { };
  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-force-bonus',
  templateUrl: './force-bonus.component.html',
  styleUrls: ['./force-bonus.component.scss']
})
export class ForceBonusComponent implements OnInit {
  @Input() force;
  constructor() { }

  ngOnInit() {
  }

}

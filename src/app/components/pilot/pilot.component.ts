import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  @Input() pilot: any;

  constructor() { }

  ngOnInit() {
  }

}

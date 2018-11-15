import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-squadron',
  templateUrl: './squadron.component.html',
  styleUrls: ['./squadron.component.scss']
})
export class SquadronComponent implements OnInit {
  @Input() squadron: any;

  constructor() { }

  ngOnInit() {
    console.log("squadron:", this.squadron);

  }

}

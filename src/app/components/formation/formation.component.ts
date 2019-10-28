import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss']
})
export class FormationComponent implements OnInit {
  @Input() position: string;
  @Input() split: boolean;

  constructor() { }

  isPosition(position) : boolean {
    return this.position === position;
  }

  ngOnInit() {
  }

}

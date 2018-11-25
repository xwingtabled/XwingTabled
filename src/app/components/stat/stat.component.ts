import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xws-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
  @Input() stat: any;
  @Input() orientation: string = "horizontal";
  @Input() bonus: boolean = false;
  constructor() { }

  ngOnInit() {
  }
}

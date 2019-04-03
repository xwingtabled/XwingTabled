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
    if (this.stat.type == "attack") {
      this.stat.icon = this.stat.arc;
    }
  }

  recoverIcons() {
    let icons = [ ];
    if (this.stat.recovers) {
      for (let i = 0; i < this.stat.recovers; i++) {
        icons.push(i);
      }
    }
    return icons;
  }
}

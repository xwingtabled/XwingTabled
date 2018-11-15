import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xwing-ship',
  templateUrl: './xwing-ship.component.html',
  styleUrls: ['./xwing-ship.component.scss']
})
export class XwingShipComponent implements OnInit {
  @Input() name: string = "";

  static icon_class_template = "xwing-miniatures-ship xwing-miniatures-ship-TEMPLATE";
  icon_class = "";

  constructor() { }


  static getClass(name: string) {
    return XwingShipComponent.icon_class_template.replace('TEMPLATE', name);
  }

  ngOnInit() {
    this.icon_class = XwingShipComponent.getClass(this.name);
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xwing-icon',
  templateUrl: './xwing-icon.component.html',
  styleUrls: ['./xwing-icon.component.scss']
})
export class XwingIconComponent implements OnInit {
  @Input() name: string = "";
  static name_map = {
    "Base All": "base-all",
    "Base Small": "base-small",
    "Base Medium": "base-medium",
    "Base Large": "base-large",
    "Critical Hit": "crit",
    "Condition Outline": "condition-outline",
    "Dalan Bank Left": "dalan-bankleft",
    "Dalan Bank Right": "dalan-bankright",
    "Helmet Imperial": "helmet-imperial",
    "Helmet Rebel": "helmet-rebel",
    "Helmet Scum": "helmet-scum",
    "Koiogran Turn": "kturn",
    "IG88D Sloop Left": "ig88d-sloopleft",
    "IG88D Sloop Right": "ig88d-sloopright",
    "Rebel Outline": "rebel-outline",
    "Talon Roll Left": "trollleft",
    "Talon Roll Right": "trollright",
    "Unique Outline": "unique-outline",
    "rebelalliance" : "rebel",
    "galacticempire" : "empire",
    "scumandvillainy" : "scum"
  };

  static icon_class_template = "xwing-miniatures-font xwing-miniatures-font-TEMPLATE";
  icon_class = "";

  constructor() { }

  static mangle(text: string) {
    Object.entries(XwingIconComponent.name_map).forEach(
      ([key, value]) => {
        text = text.replace(key, value);
      }
    )
    // Strip spaces
    text = text.replace(/\s+/g, '');
    text = text.toLowerCase();
    return text;
  }

  static getClass(name: string) {
    return XwingIconComponent.icon_class_template.replace(
      'TEMPLATE', 
      XwingIconComponent.mangle(name)
    );
  }

  ngOnInit() {
    this.icon_class = XwingIconComponent.getClass(this.name);
  }

}

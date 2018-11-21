import { Component, Input, OnInit } from '@angular/core';
import { XwingIconComponent } from '../xwing-icon/xwing-icon.component';

@Component({
  selector: 'xwing-text',
  templateUrl: './xwing-text.component.html',
  styleUrls: ['./xwing-text.component.scss']
})
export class XwingTextComponent implements OnInit {

  @Input() text: string = "Test text";
  icon_html = "<i class='CLASS'></i>"
  output: string = "";

  constructor() { }

  mangle(text: string) {
    text = this.stripNumberBrackets(text);

    // Match [Icon]
    let bracketMatches = text.match(/\[[a-zA-Z\s]*\]/g);

    if (bracketMatches) {
      bracketMatches.forEach(
        (match) => {
          let icon = this.icon_html.replace(
            'CLASS', 
            XwingIconComponent.getClass(
              this.stripBrackets(match)
            )
          );
          text = text.replace(match, icon);
        }
      )
    }

    text = text.replace("Action:", "<br /><br /><b>Action:</b>");

    return text;
  }

  stripNumberBrackets(text: string) {
    let numberMatches = text.match(/\[[0-9] \[[a-zA-Z\s]*\]\]/g);
    if (numberMatches) {
      numberMatches.forEach(
        (match) => {
          text = text.replace(match, this.stripBrackets(match));
        }
      );
    }
    return text;
  }

  stripBrackets(text: string) {
    return text.substring(1, text.length - 1);
  }

  ngOnInit() {
    this.output = this.mangle(this.text);
  }

}

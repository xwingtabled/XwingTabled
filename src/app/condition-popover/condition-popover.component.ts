import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-condition-popover',
  templateUrl: './condition-popover.component.html',
  styleUrls: ['./condition-popover.component.scss']
})
export class ConditionPopoverComponent implements OnInit {
  pilot;
  conditionObj;
  
  constructor(private popoverController: PopoverController) { }

  async removeCondition() {
    await this.popoverController.dismiss();
    let index = this.pilot.conditions.indexOf(this.conditionObj.xws);
    if (index > -1) {
      this.pilot.conditions.splice(index, 1);
    }

  }

  ngOnInit() {
    console.log(this.conditionObj);
  }

}

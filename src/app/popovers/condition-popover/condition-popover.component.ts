import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { XwingDataService } from '../../services/xwing-data.service';
@Component({
  selector: 'app-condition-popover',
  templateUrl: './condition-popover.component.html',
  styleUrls: ['./condition-popover.component.scss']
})
export class ConditionPopoverComponent implements OnInit {
  pilot;
  condition;
  img_url: string = "";
  
  constructor(private popoverController: PopoverController,
              private dataService: XwingDataService) { }

  async assignPilotDamage() {
    await this.popoverController.dismiss();
    this.pilot.damage_cards.push(this.condition.pilotDamageCard);
    this.condition.pilotDamageCard = null;
  }

  async removeCondition() {
    await this.popoverController.dismiss();
    let index = this.pilot.conditions.indexOf(this.condition);
    if (index > -1) {
      this.pilot.conditions.splice(index, 1);
    }
  }

  ngOnInit() {
    console.log(this.condition);
    this.dataService.get_image_by_url(this.condition.artwork).then(
      (url) => {
        this.img_url = url;
      }
    )
    
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { XwingDataService } from '../../services/xwing-data.service';
import { XwingStateService } from '../../services/xwing-state.service';
@Component({
  selector: 'app-condition-popover',
  templateUrl: './condition-popover.component.html',
  styleUrls: ['./condition-popover.component.scss']
})
export class ConditionPopoverComponent implements OnInit {
  cardIndex: number;
  pilotUUID: string;
  squadronUUID: string;
  condition: any = { };
  conditionData: any = { };
  pilot: any = { };
  img_url: string = "";
  
  constructor(private popoverController: PopoverController,
              private dataService: XwingDataService,
              public state: XwingStateService) { }

  async assignPilotDamage() {
    await this.popoverController.dismiss();
    this.pilot.damagecards.push(this.condition.pilotDamageCard);
    this.condition.pilotDamageCard = null;
    this.state.snapshot(this.squadronUUID);
  }

  async removeCondition() {
    await this.popoverController.dismiss();
    let index = this.pilot.conditions.indexOf(this.condition);
    if (index > -1) {
      this.pilot.conditions.splice(index, 1);
    }
    this.state.snapshot(this.squadronUUID);
  }

  ngOnInit() {
    this.condition = this.state.getCondition(this.squadronUUID, this.pilotUUID, this.cardIndex);
    this.conditionData = this.dataService.getConditionCardData(this.condition.xws);
    this.pilot = this.state.getPilot(this.squadronUUID, this.pilotUUID);
    this.dataService.get_image_by_url(this.dataService.getConditionArtwork(this.condition.xws)).then(
      (url) => {
        this.img_url = url;
      }
    )
    
  }
}

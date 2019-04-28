import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ConditionPopoverComponent } from '../../popovers/condition-popover/condition-popover.component';
import { XwingDataService } from '../../services/xwing-data.service';
import { XwingStateService } from '../../services/xwing-state.service';
@Component({
  selector: 'xws-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {
  @Input() squadronUUID;
  @Input() pilotUUID;
  @Input() cardIndex;
  condition: any = { };
  img_url: string = "";

  constructor(private dataService: XwingDataService, 
              private popoverController : PopoverController,
              private state: XwingStateService) { }

  async presentConditionPopover() {
    const popover = await this.popoverController.create({
      component: ConditionPopoverComponent,
      componentProps: {
        squadronUUID: this.squadronUUID,
        pilotUUID: this.pilotUUID,
        cardIndex: this.cardIndex
      }
    });
    await popover.present();
  }

  ngOnInit() {
    this.condition = this.state.getCondition(this.squadronUUID, this.pilotUUID, this.cardIndex);
    let conditionData = this.dataService.getConditionCardData(this.condition.xws);
    this.dataService.get_image_by_url(conditionData.artwork).then(
      (url) => {
        this.img_url = url;
      }
    )
  }
}

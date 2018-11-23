import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ConditionPopoverComponent } from '../../condition-popover/condition-popover.component';
import { XwingDataService } from '../../services/xwing-data.service';

@Component({
  selector: 'xws-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {
  @Input() pilot;
  @Input() condition;
  conditionObj: any = null;

  constructor(private dataService: XwingDataService, private popoverController : PopoverController) { }

  async presentConditionPopover() {
    const popover = await this.popoverController.create({
      component: ConditionPopoverComponent,
      componentProps: {
        pilot: this.pilot,
        conditionObj: this.conditionObj
      }
    });
    await popover.present();
  }

  ngOnInit() {
    this.conditionObj = this.dataService.getCondition(this.condition);
    this.dataService.get_image_by_url(this.conditionObj.artwork).then(
      (url) => {
        this.conditionObj.img_url = url;
      }
    )
  }
}

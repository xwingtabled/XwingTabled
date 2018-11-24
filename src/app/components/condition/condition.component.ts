import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ConditionPopoverComponent } from '../../popovers/condition-popover/condition-popover.component';
import { XwingDataService } from '../../services/xwing-data.service';

@Component({
  selector: 'xws-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {
  @Input() pilot;
  @Input() condition;
  img_url: string = "";

  constructor(private dataService: XwingDataService, private popoverController : PopoverController) { }

  async presentConditionPopover() {
    const popover = await this.popoverController.create({
      component: ConditionPopoverComponent,
      componentProps: {
        pilot: this.pilot,
        condition: this.condition
      }
    });
    await popover.present();
  }

  ngOnInit() {
    this.dataService.get_image_by_url(this.condition.artwork).then(
      (url) => {
        this.img_url = url;
      }
    )
  }
}

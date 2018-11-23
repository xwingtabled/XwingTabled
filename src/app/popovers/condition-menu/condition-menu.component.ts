import { Component, OnInit } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-condition-menu',
  templateUrl: './condition-menu.component.html',
  styleUrls: ['./condition-menu.component.scss']
})
export class ConditionMenuComponent implements OnInit {
  pilot;
  conditions: any[] = [];
  img_url: string = "";
  selected_condition: string;

  constructor(private dataService: XwingDataService, private popoverController: PopoverController) { }

  assignCondition() {
    if (this.pilot.conditions.indexOf(this.selected_condition) < 0) {
      this.pilot.conditions.push(this.selected_condition);
    }
    this.popoverController.dismiss();
  }

  changeEvent(event) {
    this.selected_condition = event.detail.value;
    this.conditions.forEach(
      (condition) => {
        if (condition.xws == event.detail.value) {
          this.img_url = condition.img_url;
        }
      }
    )
  }

  ngOnInit() {
    this.dataService.data.conditions.forEach(
      (condition) => {
        let conditionObj = JSON.parse(JSON.stringify(condition));
        this.dataService.get_image_by_url(conditionObj.artwork).then(
          (url) => {
            conditionObj.img_url = url;
          }
        );
        this.conditions.push(conditionObj);
      }
    );
  }
}

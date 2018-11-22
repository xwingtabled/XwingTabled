import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';

@Component({
  selector: 'xws-condition-summary',
  templateUrl: './condition-summary.component.html',
  styleUrls: ['./condition-summary.component.scss']
})
export class ConditionSummaryComponent implements OnInit {
  @Input() condition;
  condition_data = null;
  img_url: string;

  constructor(public dataService: XwingDataService) { }

  ngOnInit() {
    this.condition_data = this.dataService.getCondition(this.condition);
    this.dataService.get_image_by_url(this.condition_data.artwork).then(
      (url) => {
        this.img_url = url;
      }
    )
  }
}

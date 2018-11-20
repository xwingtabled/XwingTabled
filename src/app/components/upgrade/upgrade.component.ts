import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';

@Component({
  selector: 'xws-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  @Input() upgrade: any = { };
  img_class: string = "img-box";

  constructor(public dataService: XwingDataService) { }

  ngOnInit() {
    if (this.upgrade['type'] == "configuration") {
      this.img_class = "img-config-box";
    }
  }

  showUpgrade() {
    console.log(this.upgrade);
  }
}

import { Component, OnInit } from '@angular/core';
import { XwingDataService } from '../services/xwing-data.service';

@Component({
  selector: 'app-upgrade-modal',
  templateUrl: './upgrade-modal.page.html',
  styleUrls: ['./upgrade-modal.page.scss'],
})
export class UpgradeModalPage implements OnInit {
  upgrade;
  img_urls: string[] = ["", ""];

  constructor(private dataService: XwingDataService) { }

  ngOnInit() {
    console.log("upgrade modal", this.upgrade);
    for (let i = 0; i < this.upgrade.sides.length; i++) {
      this.dataService.get_image_by_url(this.upgrade.sides[i].image).then(
        (url) => {
          this.img_urls[i] = url;
        }
      )
    }
  }

  flipCard() {
    if (this.upgrade.side == 0) {
      this.upgrade.side = 1;
    } else {
      this.upgrade.side = 0;
    }
  }

}

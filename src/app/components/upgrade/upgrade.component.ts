import { Component, OnInit, Input } from '@angular/core';
import { XwingJsonDataService } from '../../services/xwing-json-data.service';
import { XwingImageService } from '../../services/xwing-image.service';

@Component({
  selector: 'xws-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  @Input() upgradeType: string;
  @Input() upgradeName: string;
  upgrade: any = { };
  current_side: any = { };
  img_class: string = "img-box";
  side_num: number = 0;

  constructor(public dataService: XwingJsonDataService, public imageService: XwingImageService) { }

  ngOnInit() {
    this.upgrade = this.dataService.getUpgrade(this.upgradeType, this.upgradeName);
    this.upgrade.sides.forEach(
      (side) => {
        this.imageService.get_image_by_url(side.image).then(
          (base64url) => {
            side.img_url = base64url;
          }
        );
        if (side.charges) {
          if (side.charges.reamining == undefined) {
            side.charges.remaining = side.charges.value;
            side.charges.numbers = Array(side.charges.recovers);
          }
        }
      }
    );
    this.current_side = this.upgrade.sides[0];
    if (this.upgradeType == "configuration") {
      this.img_class = "img-config-box";
    }
  }
}

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
  img_url: string = "";
  side_urls: string[] = [];

  constructor(public dataService: XwingJsonDataService, public imageService: XwingImageService) { }

  ngOnInit() {
    this.upgrade = this.dataService.getUpgrade(this.upgradeType, this.upgradeName);
    this.upgrade.sides.forEach(
      (side) => {
        this.imageService.get_image_by_url(side.image).then(
          (base64url) => {
            this.side_urls.push(base64url);
            this.img_url = this.side_urls[0];
          }
        )
      }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { ModalController } from '@ionic/angular';
import { LayoutService } from '../../services/layout.service';
import { XwingStateService } from '../../services/xwing-state.service';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-upgrade-modal',
  templateUrl: './upgrade-modal.page.html',
  styleUrls: ['./upgrade-modal.page.scss'],
})
export class UpgradeModalPage implements OnInit {
  upgrade;
  sides: any[] = [ ];
  img_urls: string[] = [ null, null ];
  useAngularRouter: boolean = false;

  constructor(private dataService: XwingDataService,
              public modalController: ModalController,
              public layout: LayoutService,
              private route: ActivatedRoute,
              public state: XwingStateService,
              public router: Router) { }

  ngOnInit() {
    let pilotNum = this.route.snapshot.paramMap.get("pilotNum");
    let ffg = this.route.snapshot.paramMap.get("ffg");
    if (pilotNum) {
      this.useAngularRouter = true;
      let pilot = this.state.squadron.pilots.find(pilot => pilot.num == pilotNum);
      this.upgrade = pilot.upgrades.find(
        (upgrade) => {
          let hasSide = false;
          upgrade.sides.forEach(
            (side) => {
              if (side.ffg == ffg) {
                hasSide = true;
              }
            }
          )
          return hasSide;
        }
      );
    }
    for (let i = 0; i < this.upgrade.sides.length; i++) {
      this.sides[i] = this.dataService.getCardByFFG(this.upgrade.sides[i].ffg);
    }
    for (let i = 0; i < this.sides.length; i++) {
      this.dataService.get_image_by_url(this.sides[i].card_image).then(
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

  dismiss() {
    if (this.useAngularRouter) {
      this.router.navigateByUrl("/");
    } else {
      this.modalController.dismiss();
    }
  }

}

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
  pilotNum: number;
  ffg: number;
  upgrade: any = { };
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
    let routePilotNum = this.route.snapshot.paramMap.get("pilotNum");
    let routeFFG = this.route.snapshot.paramMap.get("ffg");
    if (routePilotNum && routeFFG) {
      this.useAngularRouter = true;
      this.pilotNum = parseInt(routePilotNum);
      this.ffg = parseInt(routeFFG);
    }
    this.upgrade = this.state.getUpgradeState(this.pilotNum, this.ffg); 
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

  chargeChange(data: any) {
    this.upgrade.charges = data;
    this.state.setUpgradeState(this.pilotNum, this.upgrade);
  }

  flipCard() {
    if (this.upgrade.side == 0) {
      this.upgrade.side = 1;
    } else {
      this.upgrade.side = 0;
    }
    this.state.setUpgradeState(this.pilotNum, this.upgrade);
  }

  dismiss() {
    if (this.useAngularRouter) {
      this.router.navigateByUrl("/");
    } else {
      this.modalController.dismiss();
    }
  }

}

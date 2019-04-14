import { Component, OnInit } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { ModalController } from '@ionic/angular';
import { LayoutService } from '../../services/layout.service';
import { XwingStateService } from '../../services/xwing-state.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
@Component({
  selector: 'app-upgrade-modal',
  templateUrl: './upgrade-modal.page.html',
  styleUrls: ['./upgrade-modal.page.scss'],
})
export class UpgradeModalPage implements OnInit {
  squadronNum: number;
  pilotNum: number;
  ffg: number;
  pilot: any;
  upgrade: any = { };
  sides: any[] = [ ];
  img_urls: string[] = [ null, null ];
  useAngularRouter: boolean = false;
  chargeMax: number = 0;

  constructor(private dataService: XwingDataService,
              public modalController: ModalController,
              public layout: LayoutService,
              private route: ActivatedRoute,
              public state: XwingStateService,
              public router: Router,
              private location: Location) { }

  ngOnInit() {
    let routeSquadronNum = this.route.snapshot.paramMap.get("squadronNum");
    let routePilotNum = this.route.snapshot.paramMap.get("pilotNum");
    let routeFFG = this.route.snapshot.paramMap.get("ffg");
    if (routePilotNum && routeFFG) {
      this.useAngularRouter = true;
      this.squadronNum = parseInt(routeSquadronNum);
      this.pilotNum = parseInt(routePilotNum);
      this.ffg = parseInt(routeFFG);
      this.upgrade = this.state.getUpgradeState(this.squadronNum, this.pilotNum, this.ffg);
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
    let chargeStat = this.sides[0].statistics.find((stat) => stat.xws == "charge");
    if (chargeStat) {
      this.chargeMax = parseInt(chargeStat.value);
    }
  }

  chargeChange(data: any) {
    this.upgrade.charges = data;
    this.state.setUpgradeState(this.squadronNum, this.pilotNum, this.ffg, this.upgrade);
  }

  flipCard() {
    if (this.upgrade.side == 0) {
      this.upgrade.side = 1;
    } else {
      this.upgrade.side = 0;
    }
    this.state.setUpgradeState(this.squadronNum, this.pilotNum, this.ffg, this.upgrade);
  }

  dismiss() {
    if (this.useAngularRouter) {
      this.location.back();
    } else {
      this.modalController.dismiss();
    }
  }

}

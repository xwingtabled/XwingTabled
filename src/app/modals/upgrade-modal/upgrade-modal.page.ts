import { Component, OnInit } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { ModalController } from '@ionic/angular';
import { LayoutService } from '../../services/layout.service';
import { XwingStateService } from '../../services/xwing-state.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { Events } from '@ionic/angular';
@Component({
  selector: 'app-upgrade-modal',
  templateUrl: './upgrade-modal.page.html',
  styleUrls: ['./upgrade-modal.page.scss'],
})
export class UpgradeModalPage implements OnInit {
  squadronUUID: string;
  pilotUUID: string;
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
              private location: Location,
              private events: Events) { }

  ngOnInit() {
    let squadronUUIDParam = this.route.snapshot.paramMap.get("squadronUUID");
    let pilotUUIDParam = this.route.snapshot.paramMap.get("pilotUUID");
    let ffgParam = this.route.snapshot.paramMap.get("ffg");
    if (squadronUUIDParam && pilotUUIDParam && ffgParam) {
      this.useAngularRouter = true;
      this.squadronUUID = squadronUUIDParam;
      this.pilotUUID = pilotUUIDParam;
      this.ffg = parseInt(ffgParam);
    }
    this.initialize();
    this.events.subscribe(this.state.topic,
      (data) => {
        this.initialize();
      }
    );
  }

  initialize() {
    this.upgrade = this.state.getUpgrade(this.squadronUUID, this.pilotUUID, this.ffg);
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

  chargeChange(remaining: number) {
    this.upgrade.charges = remaining;
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
      this.location.back();
    } else {
      this.modalController.dismiss();
    }
  }

}

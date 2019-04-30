import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { LayoutService } from '../../services/layout.service';
import { PilotModalPage } from '../../modals/pilot-modal/pilot-modal.page';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular'
import { Events } from '@ionic/angular';
import { XwingStateService } from '../../services/xwing-state.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Component({
  selector: 'xws-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  @Input() squadronUUID: string;
  @Input() pilot: any;
  groups: any[][] = [];
  img_url: string = null;
  icon_url: string = null;
  shipData: any;
  data: any;
  bigStat: any = null;
  smallStat: any = null;
  chargeStat: any = null;
  forceStat: any = null;

  constructor(public dataService: XwingDataService, 
              public modalController: ModalController, 
              public platform: Platform,
              public events: Events,
              public layout: LayoutService,
              public state: XwingStateService,
              private router: Router,
              private ngZone: NgZone) { }

  getStatString(statname: string) : string {
    this.pilot.ship.stats.forEach(
      (stat) => {
        if (stat['type'] == statname) {
          if (stat.value != stat.remaining) {
            return "(" + stat.remaining + ")";
          } else {
            return stat.value;
          }
        }
      }
    );
    return "";
  }

  getPoints() {
    return this.dataService.getPointsDestroyed(this.pilot) +
          ' / ' + this.dataService.getPilotPoints(this.pilot);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.data = this.dataService.getCardByFFG(this.pilot.ffg);
    let numGroups = this.pilot.upgrades.length >= 9 ? 3 : 2;
    let groupSize = Math.ceil(this.pilot.upgrades.length / numGroups);
    this.groups = [ ];
    for (let i = 0; i < numGroups; i++) {
      let group: any[] = [];
      for (let j = 0; j < groupSize; j++) {
        let index = i * groupSize + j;
        if (this.pilot.upgrades[index]) {
          group.push(this.pilot.upgrades[index]);
        }
      }
      this.groups.push(group);
    }
    let group: any[] = [];

    let get_url = this.data.image;
    if (get_url) {
      this.dataService.get_image_by_url(get_url).then(
        (url) => {
          this.img_url = url;
        }
      )
    }

    let get_icon_url = this.data.metadata.shipIcon;
    if (get_icon_url) {
      this.dataService.get_image_by_url(get_icon_url).then(
        (url) => {
          this.icon_url = url;
        }
      )
    }
  }

  numFacedown() {
    if (this.pilot.damagecards) {
      let facedown = this.pilot.damagecards.filter(card => !card.exposed);
      if (facedown) {
        return facedown.length;
      }
    }
    return 0;
  }

  generateStat(stat: string) {
    if(!(stat in this.pilot)) {
      return null;
    }
    return { 
      type: stat, 
      value: this.dataService.getStatTotal(this.pilot, stat),
      remaining: this.pilot[stat]
    }
  }

  showOverlay() {
    let hullTotal = this.dataService.getStatTotal(this.pilot, "hull");
    let hullStat = {
      type: "hull",
      value: hullTotal,
      remaining: hullTotal - this.pilot.damagecards.length
    }

    let shieldStat = this.generateStat("shields");
    
    if (hullStat.remaining < hullStat.value || !shieldStat) {
      this.bigStat = hullStat;
      this.smallStat = shieldStat;
    } else {
      this.bigStat = shieldStat;
      this.smallStat = hullStat;
    }

    if ("charges" in this.pilot) {
      this.chargeStat = this.dataService.getCardStatObject(
        this.pilot.ffg, "charge", this.pilot.charges
      );
    }

    this.forceStat = this.generateStat("force");
    if (this.forceStat) {
      this.forceStat.recovers = 1;
    }

    return true;
  }

  async presentPilotModal() {
    let stateString = JSON.stringify(this.pilot);
    const modal = await this.modalController.create({
      component: PilotModalPage,
      componentProps: {
        squadronUUID: this.squadronUUID,
        pilotUUID: this.pilot.uuid
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (stateString != JSON.stringify(this.pilot)) {
      this.state.snapshot(this.squadronUUID);
    }
  }

  showPilot() {
    if (this.layout.isPhone()) {
      let url = '/squadron/' + this.squadronUUID + '/pilot/' + this.pilot.uuid;
      this.router.navigateByUrl(url);
    } else {
      this.presentPilotModal();
    }
  }
}

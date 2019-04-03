import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { LayoutService } from '../../services/layout.service';
import { PilotModalPage } from '../../modals/pilot-modal/pilot-modal.page';
import { TokenModalPage } from '../../modals/token-modal/token-modal.page';
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
  @Input() pilot: any;
  groups: any[][] = [];
  img_url: string = null;
  shipData: any;
  pilotData: any;
  shields: any = null;
  charges: any = null;
  force: any = null;

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

  ngOnInit() {
    let numGroups = this.pilot.upgrades >= 9 ? 3 : 2;
    let groupSize = Math.ceil(this.pilot.upgrades.length / numGroups);
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

    let get_url = this.pilot.pilot.artwork;
    if (!get_url) {
      get_url = this.pilot.pilot.image;
    }
    if (get_url) {
      this.dataService.get_image_by_url(get_url).then(
        (url) => {
          this.img_url = url;
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

  createTokens(stat, tokenType) {
    let tokens = [ ];
    if (!stat) {
      return tokens;
    }
    for (let i = 0; i < stat.remaining; i++) {
      tokens.push(
        {
          name: tokenType,
          css: tokenType
        }
      )
    }
    for (let i = 0; i < stat.value - stat.remaining; i++) {
      tokens.push(
        {
          name: tokenType,
          css: tokenType + ' spent'
        }
      )
    }
    return tokens;

  }

  createMiniTokenDisplay() {
    let tokens = [ ]
    // Find stats with tokens to display
    tokens = tokens.concat(
      this.createTokens(
        this.pilot.stats.find((stat) => stat.type == 'shields'),
        'shield'
      )
    );
    tokens = tokens.concat(
      this.createTokens(
        this.pilot.stats.find((stat) => stat.type == 'charges'),
        'charge'
      )
    );
    tokens = tokens.concat(
      this.createTokens(
        this.pilot.stats.find((stat) => stat.type == 'force'),
        'force'
      )
    );
    return tokens;
  }

  async presentPilotModal() {
    let stateString = JSON.stringify(this.pilot);
    const modal = await this.modalController.create({
      component: PilotModalPage,
      componentProps: {
        pilot: this.pilot,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (stateString != JSON.stringify(this.pilot)) {
      this.state.snapshot();
    }
  }

  async presentTokenModal() {
    let stateString = JSON.stringify(this.pilot);
    const modal = await this.modalController.create({
      component: TokenModalPage,
      componentProps: {
        pilot: this.pilot,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (stateString != JSON.stringify(this.pilot)) {
      this.state.snapshot();
    }
  }

  showPilot() {
    if (this.layout.isPhone()) {
      this.router.navigateByUrl('pilot/' + this.pilot.num +'/card');
    } else {
      this.presentPilotModal();
    }
  }

  showTokens() {
    if (this.layout.isPhone()) {
      this.router.navigateByUrl('pilot/' + this.pilot.num +'/tokens');
    } else {
      this.presentTokenModal();
    }
  }

  showImage() {
    let lineNums = this.pilot.damagecards.filter(
      (card) => card.exposed
    ).length;
    if (this.pilot.damagecards.find((card) => !card.exposed)) {
      lineNums++;
    }
    if (this.createMiniTokenDisplay().length > 0) {
      lineNums++;
    }
    return lineNums < 5;
  }
}

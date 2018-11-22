import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { XwsModalPage } from '../xws-modal/xws-modal.page';
import { LoadingPage } from '../loading/loading.page';
import { Router } from '@angular/router';
import { XwingDataService } from '../services/xwing-data.service';
import { Platform } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { DamageDeckActionsComponent } from '../damage-deck-actions/damage-deck-actions.component';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  squadrons: any = [ ];
  constructor(public modalController: ModalController, 
              public dataService: XwingDataService,
              public router: Router,
              public platform: Platform,
              public popoverController: PopoverController) { }

  ngOnInit() {
    if (!this.dataService.initialized) {
      this.presentLoadingModal();
    }
  }

  async presentDamageDeckActionsPopover(ev: any, squadron: any) {
    const popover = await this.popoverController.create({
      component: DamageDeckActionsComponent,
      componentProps: {
        squadron: squadron
      },
      event: ev
    });
    return await popover.present();
  }

  squadronCss() {
    if (this.platform.isPortrait()) {
      return 'squadron-fullwidth';
    }
    if (this.squadrons.length > 1) { 
      return 'squadron-halfwidth';
    } else {
      return 'squadron-fullwidth';
    }
  }

  pilotCss() {
    if (this.platform.isPortrait()) {
      return 'pilot-fullwidth';
    } else {
      return 'pilot-minwidth';
    }
  }

  injectShipData(pilot: any, faction: string) {
    pilot.ship = this.dataService.getShip(faction, pilot.ship);

    pilot.ship.stats.forEach(
      (stat) => {
        if (stat['type'] == 'hull') {
          pilot['hull'] = { value: stat.value, remaining: stat.value };
        }
        if (stat['type'] == 'shields') {
          pilot['shields'] = { value: stat.value, remaining: stat.value }; 
        }
      }
    )
  }

  async injectPilotData(pilot: any, faction: string) {
    pilot.pilot = this.dataService.getPilot(faction, pilot.ship.keyname, pilot.name);
    let img_url = pilot.pilot.image;
    pilot.image = await this.dataService.get_image_by_url(img_url);
    if (pilot.pilot.charges) {
      pilot.charges = JSON.parse(JSON.stringify(pilot.pilot.charges));
      if (pilot.charges.remaining == undefined) {
        pilot.charges.remaining = pilot.charges.value;
        pilot.charges.numbers = Array(pilot.charges.recovers);
      }
    }
    // Copy force data to pilot object root
    if (pilot.pilot.force) {
      pilot.force = JSON.parse(JSON.stringify(pilot.pilot.force));
      pilot.force.remaining = pilot.force.value;
      pilot.force.numbers = Array(pilot.force.recovers);
    }
    pilot.damagecards = []; 
    pilot.pointsDestroyed = 0;
  }

  mangleUpgradeArray(pilot: any) {
    let mangledUpgrades = [ ];
    if (pilot.upgrades) {
      Object.entries(pilot.upgrades).forEach(
        ( [upgradeType, upgradeArray ] ) => {
          if (Array.isArray(upgradeArray)) {
            upgradeArray.forEach(
              (upgradeName) => {
                if (upgradeType == "force") {
                  upgradeType = "forcepower";
                }
                let upgradeData = this.dataService.getUpgrade(upgradeType, upgradeName);
                upgradeData['type'] = upgradeType;
                mangledUpgrades.push(upgradeData);
              }
            )
          }
        }
      );
    }
    pilot.upgrades = mangledUpgrades;
  }

  async injectUpgradeData(pilot: any, upgrade: any) {
    // Set default "side" of upgrade card to side 0
    upgrade.side = 0;

    // Process each side
    upgrade.sides.forEach(
      async (side) => {
        let img_url = side.image;
        side.image = await this.dataService.get_image_by_url(img_url);
        if (side.charges) {
          if (side.charges.remaining == undefined) {
            side.charges.remaining = side.charges.value;
            side.charges.numbers = Array(side.charges.recovers);
          }
        }
        if (side.force) {
          side.force.numbers = Array(side.force.recovers);
        } 
      }
    )
  }

  injectShipBonuses(pilot: any) {
    pilot.upgrades.forEach(
      (upgrade) => {
        let side = upgrade.sides[0];
        if (side.grants) {
          side.grants.forEach(
            (grant) => {
              if (grant.value == "shields" || grant.value == "hull") {
                pilot[grant.value].value += grant.amount;
                pilot[grant.value].remaining = pilot[grant.value].value;
              }
            }
          )
        }
      }
    )
  }

  injectForceBonuses(pilot: any) {
    pilot.upgrades.forEach(
      (upgrade) => {
        let side = upgrade.sides[0];
        if (side.force) {
          if (!pilot.force) {
            pilot.force = { value: 0, recovers: 0, numbers: [] }
          }
          pilot.force.value += side.force.value;
          pilot.force.recovers += side.force.recovers;
        }
      }
    )
    if (pilot.force) {
      pilot.force.numbers = Array(pilot.force.recovers);
      pilot.force.remaining = pilot.force.value;
    }
  }

  xwsAddButton() {
    this.presentXwsModal();
  }

  async presentXwsModal() {
    const modal = await this.modalController.create({
      component: XwsModalPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    data.damagediscard = [ ];
    data.damagedeck = this.dataService.getDamageDeck();
    data.pilots.forEach(
      (pilot) => {
        this.injectShipData(pilot, data.faction);
        this.injectPilotData(pilot, data.faction);
        this.mangleUpgradeArray(pilot);
    
        // Process each upgrade card
        pilot.upgrades.forEach(
          (upgrade) => {
            this.injectUpgradeData(pilot, upgrade);
          }
        );
        this.injectShipBonuses(pilot);
        this.injectForceBonuses(pilot);
      }
    )
    data.pointsDestroyed = 0;
    console.log("xws loaded and data injected", data);
    if (data) {
      this.squadrons.push(data);
    }
  }

  async presentLoadingModal() {
    const modal = await this.modalController.create({
      component: LoadingPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }
}

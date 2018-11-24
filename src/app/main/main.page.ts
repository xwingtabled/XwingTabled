import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { XwsModalPage } from '../modals/xws-modal/xws-modal.page';
import { Router } from '@angular/router';
import { XwingDataService } from '../services/xwing-data.service';
import { Platform } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DamageDeckActionsComponent } from '../popovers/damage-deck-actions/damage-deck-actions.component';
import { NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  snapshots = [ ];
  squadrons: any = [ ];

  data_progress: number = 0;
  data_message: string = "X-Wing Tabled";
  data_button: boolean = false;
  data_button_disabled: boolean = false;
  image_button: boolean = false;
  image_button_disabled: boolean = false;

  constructor(public modalController: ModalController, 
              public dataService: XwingDataService,
              public router: Router,
              public platform: Platform,
              public popoverController: PopoverController,
              private events: Events,
              private alertController: AlertController,
              private ngZone: NgZone,
              private toastController: ToastController,
              private storage: Storage) { }

  ngOnInit() {
    this.events.subscribe(
      this.dataService.topic,
      (event) => {
        this.data_event_handler(event);
      }
    );

    this.events.subscribe(
      "snapshot",
      (event) => {
        this.snapshot();
      }
    )

  }

  async restoreFromDisk() {
    await this.storage.ready();
    let snapshots = await this.storage.get("snapshots");
    this.ngZone.run(
      () => {
        if (snapshots) {
          this.snapshots = snapshots;
          let lastSnapshot = JSON.parse(JSON.stringify(this.snapshots[this.snapshots.length - 1]));
          this.squadrons = lastSnapshot.squadrons;
          console.log(this.squadrons);
          this.toastUndo(lastSnapshot.time);
        }
      }
    )
  }

  snapshot() {
    if(this.snapshots.length >= 5) {
      this.snapshots.shift();
    }
    this.snapshots.push({ time: new Date().toISOString(), squadrons: JSON.parse(JSON.stringify(this.squadrons)) } );
    this.storage.set("snapshots", this.snapshots);
    console.log("snapshot created", this.snapshots);
  }

  data_event_handler(event: any) {
    this.data_message = event.message;
    this.data_progress = event.progress;
    if (event.status == "manifest_outofdate") {
      this.data_button = true;
      this.data_message = "X-Wing Tabled requires a local data update";
    }
    if (event.status == "manifest_current" || event.status == "data_download_complete") {
      this.data_button = false;
    }
    if (event.status == "images_missing") {
      this.data_message = "X-Wing Tabled needs to download some artwork";
      this.image_button = true;
    }
    if (event.status == "images_complete") {
      this.image_button = false;
      this.restoreFromDisk();
    }
    if (event.status == "image_download_incomplete") {
      this.image_button = true;
    }
    if (event.status == "image_download_complete") {
      this.restoreFromDisk();
    }
  }

  downloadData() {
    this.data_button_disabled = true;
    this.dataService.download_data();
  }

  downloadArtwork() {
    this.image_button_disabled = true;
    this.dataService.download_missing_images(this.dataService.data);
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

  async removeSquadron(squadron: any) {
    const alert = await this.alertController.create({
      header: 'Remove squadron?',
      message: 'You are about to remove ' + squadron.name,
      buttons: [
        { text: 'OK',
          handler: () => { 
            let index = this.squadrons.indexOf(squadron);
            this.squadrons.splice(index, 1);
            this.events.publish("snapshot", "create snapshot");
          }
        },
        { text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary' }
      ]
    });
    return await alert.present();
  }

  async askRechargeRecurring() {
    const alert = await this.alertController.create({
      header: 'Recharge Recurring',
      message: 'Do you wish to recover all recurring ' +
               '<i class="xwing-miniatures-font xwing-miniatures-font-charge"></i> and ' +
               '<i class="xwing-miniatures-font xwing-miniatures-font-forcecharge"></i>?',
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              () => {
                this.rechargeAllRecurring();
              }
            )
          }
        },
        { text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary' }
      ]
    });
    return await alert.present();
  }

  async toastUndo(timestamp: string) {
    const toast = await this.toastController.create({
      message: 'Table restored to ' + timestamp,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async askUndo() {
    const alert = await this.alertController.create({
      header: 'Rewind Time?',
      message: 'This will rewind time to ' + this.snapshots[this.snapshots.length - 2].time,
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              () => {
                this.snapshots.pop();
                let snapshot = this.snapshots.pop();
                this.squadrons = snapshot.squadrons;
                this.events.publish("snapshot", "create snapshot");
                this.toastUndo(snapshot.time);
              }
            )
          }
        },
        { text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary' }
      ]
    });
    return await alert.present(); 
  }

  async resetSquadrons() {
    this.squadrons.forEach(
      (squadron) => {
        squadron.pointsDestroyed = 0;
        squadron.damagediscard = [ ];
        squadron.damagedeck = this.dataService.getDamageDeck();
        squadron.pilots.forEach(
          (pilot) => {
            pilot.damagecards = [ ];
            pilot.conditions = [ ];
            pilot.pointsDestroyed = 0;
            pilot.hull.remaining = pilot.hull.value;
            [ pilot.shields, pilot.charges, pilot.force ].forEach(
              (stat) => {
                if (stat) {
                  stat.remaining = stat.value;
                }
              }
            )
            pilot.upgrades.forEach(
              (upgrade) => {
                upgrade.side = 0;
                if (upgrade.sides[0].charges) {
                  upgrade.sides[0].charges.remaining = upgrade.sides[0].charges.value;
                }
              }
            )
          }
        )
      }
    )
    this.events.publish("snapshot", "create snapshot");
    const toast = await this.toastController.create({
      message: 'Squadrons reset',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async askReset() {
    const alert = await this.alertController.create({
      header: 'Reset all squadrons?',
      message: 'All charges, force and shields will be restored, damage cards shuffled and conditions removed.',
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              () => {
                this.resetSquadrons();
              }
            )
          }
        },
        { text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary' }
      ]
    });
    return await alert.present(); 
  }

  rechargeAllRecurring() {
    this.squadrons.forEach(
      (squadron) => {
        squadron.pilots.forEach(
          (pilot) => {
            if (pilot.charges && pilot.charges.recovers) {
              pilot.charges.remaining += pilot.charges.recovers;
              if (pilot.charges.remaining > pilot.charges.value) {
                pilot.charges.remaining = pilot.charges.value;
              }
              pilot.charges = JSON.parse(JSON.stringify(pilot.charges));
            }
            if (pilot.force && pilot.force.recovers) {
              pilot.force.remaining += pilot.force.recovers;
              if (pilot.force.remaining > pilot.force.value) {
                pilot.force.remaining = pilot.force.value;
              }
              pilot.force = JSON.parse(JSON.stringify(pilot.force));
            }
            pilot.upgrades.forEach(
              (upgrade) => {
                let side = upgrade.sides[0];
                if (side.charges && side.charges.recovers) {
                  side.charges.remaining += side.charges.recovers;
                  if (side.charges.remaining > side.charges.value) {
                    side.charges.remaining = side.charges.value;
                  }
                  side.charges = JSON.parse(JSON.stringify(side.charges));
                }
              }
            )
          }
        )
      }
    )
    this.events.publish("snapshot", "create snapshot");
  }

  injectShipData(pilot: any, faction: string) {
    pilot.ship = this.dataService.getShip(faction, pilot.ship);
    pilot.stats = [ ];

    pilot.ship.stats.forEach(
      (stat) => {
        let statCopy = JSON.parse(JSON.stringify(stat));
        statCopy.remaining = stat.value;
        if (stat.recovers) {
          statCopy.numbers = new Array(stat.recovers);
        }
        if (stat.type == 'force') {
          stat.icon = 'forcecharge';
        }
        if (stat.type == 'charges') {
          stat.icon = 'charge';
        }
        if (stat.type == 'attack') {
          stat.icon = stat.arc;
        }
        pilot.stats.push(statCopy);
      }
    )
  }

  injectPilotData(pilot: any, faction: string) {
    pilot.pilot = this.dataService.getPilot(faction, pilot.ship.keyname, pilot.name);
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
    pilot.conditions = [];
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

  injectUpgradeData(pilot: any, upgrade: any) {
    // Set default "side" of upgrade card to side 0
    upgrade.side = 0;

    // Process each side
    upgrade.sides.forEach(
      (side) => {
        let img_url = side.image;
        if (side.charges) {
          side.charges.type = "charges"
          side.charges.icon = "charge";
          if (side.charges.remaining == undefined) {
            side.charges.remaining = side.charges.value;
            side.charges.numbers = Array(side.charges.recovers);
          }
        }
        if (side.force) {
          side.force.numbers = Array(side.force.recovers);
          side.force.type = "force";
          side.force.icon = "forcecharge";
        } 
        if (side.attack) {
          side.attack.type = "attack";
          side.attack.icon = side.attack.arc;
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
                pilot.stats.forEach(
                  (stat) => {
                    if (stat.type == grant.value) {
                      stat.value += grant.amount;
                      stat.remaining = stat.value;
                    }
                  }
                )
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
    if (data) {
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
      this.squadrons.push(data);
      this.events.publish("snapshot", "create snapshot");
    }
  }
}

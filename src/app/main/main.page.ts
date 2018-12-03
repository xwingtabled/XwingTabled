import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { XwsModalPage } from '../modals/xws-modal/xws-modal.page';
import { Router } from '@angular/router';
import { XwingDataService } from '../services/xwing-data.service';
import { Platform } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DamageDeckActionsComponent } from '../popovers/damage-deck-actions/damage-deck-actions.component';
import { NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';

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
  retry_button: boolean = false;
  retry_button_disabled: boolean = false;
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
              private storage: Storage,
              private http: HttpProvider,
              private loadingCtrl: LoadingController) { }

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
          if (this.squadrons && this.squadrons.length == 0) {
            this.presentXwsModal();
          }
        } else {
          this.presentXwsModal();
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

  async data_event_handler(event: any) {
    this.data_message = event.message;
    this.data_progress = event.progress;
    if (event.status == "manifest_incomplete") {
      this.data_button = true;
      this.data_message = "X-Wing Tabled requires a local data update";
    }
    if (event.status == "data_download_errors") {
      this.data_button = true;
      this.data_message = "Some X-Wing data could not be downloaded";
    }
    if (event.status == "no_data_no_connection") {
      this.retry_button = true;
      this.retry_button_disabled = false;
      const alert = await this.alertController.create({
        header: 'Internet Connection Required',
        message: 'An Internet connection is required to update or download necessary data files the first time X-Wing Tabled runs.',
        buttons: [
          { text: 'Retry',
            handler: () => { 
              this.ngZone.run(
                async () => {
                  await this.alertController.dismiss();
                  this.retryDownload();
                }
              )
            }
          },
        ]
      });
      return await alert.present();
    }
    if (event.status == "loading_images") {
      // Disable screen interactions with LoadingController
      const loading = await this.loadingCtrl.create({
        message: "Loading artwork"
      });
      await loading.present();
      // Once the loading screen is present, signal XwingDataService that
      // the controller is present. It will begin image loading sequence.
      this.events.publish("mainpage", { message : "loading_controller_present" });
    }
    if (event.status == "loading_images_complete") {
      try {
        await this.loadingCtrl.dismiss();
      } catch (err) {
        
      }
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

  retryDownload() {
    this.retry_button_disabled = true;
    this.retry_button = false;
    this.dataService.check_manifest();
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
            this.ngZone.run(
              () => {
                let index = this.squadrons.indexOf(squadron);
                this.squadrons.splice(index, 1);
                this.events.publish("snapshot", "create snapshot");
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

  async resetData(squadron: any) {
    const alert = await this.alertController.create({
      header: 'Clear data cache?',
      message: 'You are about to reset your data cache. You may have to re-download some data.',
      buttons: [
        { text: 'OK',
          handler: () => {
            this.ngZone.run(
              () => {
                this.squadrons = [ ];
                this.snapshots = [ ];
                this.data_progress = 0;
                this.data_message = "X-Wing Tabled";
                this.data_button = false;
                this.data_button_disabled = false;
                this.image_button = false;
                this.image_button_disabled = false;
                this.dataService.reset();
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
        this.shuffleDamageDeck(squadron);
        squadron.pilots.forEach(
          (pilot) => {
            pilot.damagecards = [ ];
            pilot.conditions = [ ];
            pilot.pointsDestroyed = 0;
            pilot.stats.forEach(
              (stat) => {
                stat.remaining = stat.value;
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
    let recover = (stat) => {
      stat.remaining += stat.recovers;
      if (stat.remaining > stat.value) {
        stat.remaining = stat.value;
      }
    }
    this.squadrons.forEach(
      (squadron) => {
        squadron.pilots.forEach(
          (pilot) => {
            for (let i = 0; i < pilot.stats.length; i++) {
              let stat = pilot.stats[i];
              if (stat.recovers) {
                recover(stat);
                pilot.stats.splice(i, 1, JSON.parse(JSON.stringify(stat)));
              }
            }
            pilot.upgrades.forEach(
              (upgrade) => {
                let side = upgrade.sides[0];
                if (side.charges && side.charges.recovers) {
                  recover(side.charges);
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
    // Inject ship data into pilot
    pilot.ship = this.dataService.getShip(faction, pilot.ship);

    // Inject stats array in pilot root
    pilot.stats = [ ];
    pilot.ship.stats.forEach(
      (stat) => {
        let statCopy = JSON.parse(JSON.stringify(stat));
        // Future proofing - in case a chassis ever has baked in recurring charge stats
        statCopy.remaining = stat.value;
        if (stat.recovers) {
          statCopy.numbers = new Array(stat.recovers);
        }
        pilot.stats.push(statCopy);
      }
    )
  }

  injectPilotData(pilot: any, faction: string) {
    // Get pilot data and insert it into pilot object
    pilot.pilot = this.dataService.getPilot(faction, pilot.ship.keyname, pilot.id);

    // Creates a stat of { type: statType, remaining: 2, numbers: Array() }
    // for display compatibility
    let pushStat = (stat, statType) => {
      let statCopy = JSON.parse(JSON.stringify(stat));
      statCopy.type = statType;
      statCopy.remaining = stat.value;
      statCopy.numbers = Array(stat.numbers);
      pilot.stats.push(statCopy);
    }
    // If the pilot has charges, insert it as a stat
    if (pilot.pilot.charges) {
      pushStat(pilot.pilot.charges, 'charges');
    }
    // If the pilot has force, insert it as a stat
    if (pilot.pilot.force) {
      pushStat(pilot.pilot.force, 'force');
    }

    // Add additional game state variables
    pilot.damagecards = []; 
    pilot.conditions = [];
    pilot.pointsDestroyed = 0;
  }

  mangleUpgradeArray(pilot: any) {
    // Take xws upgrade list {'astromech': ['r2d2']} and mangle it to
    // [ { type: 'astromech', name: 'r2d2', etc... } ]
    let mangledUpgrades = [ ];
    if (pilot.upgrades) {
      Object.entries(pilot.upgrades).forEach(
        ( [upgradeType, upgradeArray ] ) => {
          if (Array.isArray(upgradeArray)) {
            upgradeArray.forEach(
              (upgradeName) => {
                // 
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
        // Mangle charges stats
        if (side.charges) {
          side.charges.type = "charges"
          side.charges.remaining = side.charges.value;
          side.charges.numbers = Array(side.charges.recovers);
        }
        // Mangle force stats
        if (side.force) {
          side.force.numbers = Array(side.force.recovers);
          side.force.type = "force";
        } 
        // Mangle attack stats
        if (side.attack) {
          side.attack.type = "attack";
          // Displayed icon should be the attack's icon
          side.attack.icon = side.attack.arc;
        }
      }
    )
  }

  injectShipBonuses(pilot: any) {
    // Search upgrades for any upgrade that has a 'grant'
    pilot.upgrades.forEach(
      (upgrade) => {
        let side = upgrade.sides[0];
        if (side.grants) {
          // Find shield or hull bonuses
          let grant = side.grants.find((grant) => grant.value == "shields" || grant.value == "hull");
          if (grant) {
            // Find the granted bonus stat on the pilot and add it
            let stat = pilot.stats.find((element) => element.type == grant.value);
            stat.value += grant.amount;
            stat.remaining = stat.value; 
          }
        }
      }
    )
  }

  injectForceBonuses(pilot: any) {
    // Add any force bonuses to the pilot, creating a force stat if necessary
    pilot.upgrades.forEach(
      (upgrade) => {
        let side = upgrade.sides[0];
        // Find upgrades that have a force bonus
        if (side.force) {
          // Get the pilot's force stat
          let forceStat = pilot.stats.find((element) => element.type == 'force');
          // If no force stat exists, create one
          if (!forceStat) {
            forceStat = { value: 0, recovers: 0, type: 'force', numbers: [] };
            pilot.stats.push(forceStat);
          }
          // Add force bonuses
          forceStat.value += side.force.value;
          forceStat.recovers += side.force.recovers;
          forceStat.numbers = Array(forceStat.recovers);
          forceStat.remaining = forceStat.value;
        }
      }
    )
  }

  calculatePoints(pilot: any) {
    let pilotCost = pilot.pilot.cost;
    let upgradeCost = 0;
    pilot.upgrades.forEach(
      (upgrade) => {
        if ("value" in upgrade.cost) {
          upgradeCost += upgrade.cost.value;
        }
        if ("variable" in upgrade.cost) {
          let statValue = "";
          if (upgrade.cost.variable == "size") {
            statValue = pilot.ship.size;
          } else {
            statValue = pilot.stats.find((stat) => stat.type == upgrade.cost.variable).value;
          }
          upgradeCost += upgrade.cost.values[statValue];
        }
      }
    );
    pilot.points = pilotCost + upgradeCost;
  }

  shuffleDamageDeck(squadron: any) {
    let newDeck = [ ];
    while (squadron.damagedeck.length > 0) {
      let index = Math.floor(Math.random() * Math.floor(squadron.damagedeck.length));
      let card = squadron.damagedeck[index];
      squadron.damagedeck.splice(index, 1);
      newDeck.push(card);
    }
    squadron.damagedeck = newDeck;

  }

  xwsAddButton() {
    this.presentXwsModal();
  }

  async processFFG(uuid: string) {
    let url = "https://squadbuilder.fantasyflightgames.com/api/squads/" + uuid + "/";
    
    this.http.get(url).subscribe(
      (data) => {

        let cost = data.cost;
        let name = data.name;
        let faction = data.faction.name;
        let pilots = [ ];
        data.deck.forEach(
          (pilot) => {
            let xwsPilot = this.dataService.getXwsFromFFG(pilot.pilot_card.id);
            xwsPilot.points = pilot.cost;
            let upgrades = { };
            pilot.slots.forEach(
              (upgrade) => {
                let upgradeData = this.dataService.getXwsFromFFG(upgrade.id);
                if (upgrades[upgradeData.type] == undefined) {
                  upgrades[upgradeData.type] = [ ];
                }
                upgrades[upgradeData.type].push(upgradeData.xws);
              }
            )
            xwsPilot.upgrades = upgrades;
            pilots.push(xwsPilot);
          }
        );
        let squadron = {
          description: data.description,
          faction: data.faction.name.replace(/ /g, '').toLowerCase(),
          name: data.name,
          points: data.cost,
          pilots: pilots
        }
        console.log("FFG SquadBuilder response", data);
        console.log("FFG -> XWS", squadron);
        this.processXws(squadron);
      },
      (error) => {
        console.log("Unable to get FFG SquadBuilder data", error);
      }
    )
  }

  async processYasb(data: any) {
    let pilots = [ ];
    data.pilots.forEach(
      (pilot) => {
        let yasbPilot = this.dataService.getYasbPilot(pilot.id);
        let xwsPilot = { id: yasbPilot.xws, ship: yasbPilot.ship, upgrades: { } };
        let upgrades = { };
        pilot.upgrades.forEach(
          (upgrade) => {
            let yasbUpgrade = this.dataService.getYasbUpgrade(parseInt(upgrade));
            if (upgrades[yasbUpgrade.slot] == undefined) {
              upgrades[yasbUpgrade.slot] = [ ];
            }
            upgrades[yasbUpgrade.slot].push(yasbUpgrade.xws);
          }
        )
        xwsPilot.upgrades = upgrades;
        pilots.push(xwsPilot);
      }
    )
    let squadron = {
      name: data.name,
      faction: data.faction,
      pilots: pilots
    };
    console.log("YASB squadron", squadron);
    return await this.processXws(squadron);
  }

  async processXws(squadron: any) {
    this.ngZone.run(
      () => {
        let squadPoints = 0;
        squadron.damagediscard = [ ];
        squadron.damagedeck = this.dataService.getDamageDeck();
        squadron.pilots.forEach(
          (pilot) => {
            this.injectShipData(pilot, squadron.faction);
            this.injectPilotData(pilot, squadron.faction);
            this.mangleUpgradeArray(pilot);
        
            // Process each upgrade card
            pilot.upgrades.forEach(
              (upgrade) => {
                this.injectUpgradeData(pilot, upgrade);
              }
            );

            this.calculatePoints(pilot);
            squadPoints += pilot.points;

            this.injectShipBonuses(pilot);
            this.injectForceBonuses(pilot);
          }
        )
        squadron.points = squadPoints;
        squadron.pointsDestroyed = 0;
        this.shuffleDamageDeck(squadron);
        console.log("xws loaded and data injected", squadron);
        this.squadrons = [ squadron ];
        this.events.publish("snapshot", "Squadron " + squadron.name + " added");
      }
    )
    const toast = await this.toastController.create({
      message: 'Squadron added, Damage Deck shuffled',
      duration: 2000,
      position: 'bottom'
    });
    return await toast.present();
  }

  async presentXwsModal() {
    const modal = await this.modalController.create({
      component: XwsModalPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) return;
    if (data.ffg) {
      return this.processFFG(data.ffg);
    }
    if (data.yasb) {
      return this.processYasb(data.yasb);
    }
    if (data.xws) {
      let squadron = data.xws;
      return this.processXws(squadron);
    }
  }
}

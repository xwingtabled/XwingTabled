import { Injectable } from '@angular/core';
import { XwingDataService } from './xwing-data.service';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class XwingStateService {
  public initialized: boolean = false;
  public squadrons: any[ ] = [ ];
  public snapshots: any[ ] = [ ];

  constructor(public dataService: XwingDataService,
              private events: Events,
              private storage: Storage,
              public toastController: ToastController) {

  }

  reset() {
    this.squadrons = [ ];
    this.snapshots = [ ];
    this.initialized = false;
  }

  async restoreFromDisk() {
    await this.storage.ready();
    let snapshots = await this.storage.get("snapshots");

    if (snapshots) {
      this.snapshots = snapshots;
      let lastSnapshot = JSON.parse(JSON.stringify(this.snapshots[this.snapshots.length - 1]));
      if (lastSnapshot.squadrons) {
        this.squadrons = lastSnapshot.squadrons;
      }
      console.log("Squadrons restored", this.squadrons);
      this.initialized = true;
    } else {
      this.initialized = false;
    }
  }

  getLastSnapshotTime() {
    return this.snapshots[this.snapshots.length - 1].time;
  }

  resetSquadron(squadronNum: any) {
    let squadron = this.squadrons[squadronNum];
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
    this.snapshot();
  }

  getPilotState(squadronNum: number, pilotNum: number) {
    let squadron = this.squadrons[squadronNum];
    return squadron.pilots.find(pilot => pilot.num == pilotNum); 
  }

  getUpgradeState(squadronNum: number, pilotNum: any, upgradeFFG: number) {
    let pilot = this.getPilotState(squadronNum, pilotNum);
    let upgrade = pilot.upgrades.find(
      (upgrade) => {
        let hasSide = false;
        upgrade.sides.forEach(
          (side) => {
            if (side.ffg == upgradeFFG) {
              hasSide = true;
            }
          }
        )
        return hasSide;
      }
    );
    return upgrade;
  }

  getSquadronPointsDestroyed(squadronNum: number) {
    let squadron = this.squadrons[squadronNum];
    let points = 0;
    squadron.pilots.forEach(
      (pilot) => {
        points += this.dataService.getPointsDestroyed(pilot);
      }
    )
    return points;
  }

  getSquadronPointTotal(squadronNum: number) {
    let squadron = this.squadrons[squadronNum];
    let points = 0;
    squadron.pilots.forEach(
      (pilot) => {
        points += this.dataService.getPilotPoints(pilot);
      }
    )
    return points;
  }

  setUpgradeState(squadronNum: number, pilotNum: any, upgradeFFG: number, newData: any) {
    let pilot = this.getPilotState(squadronNum, pilotNum);
    newData = JSON.parse(JSON.stringify(newData));
    for (let i = 0; i < pilot.upgrades.length; i++) {
      if (pilot.upgrades[i].sides[0].ffg == upgradeFFG) {
        pilot.upgrades[i] = newData;
        return;
      }
    }
    // TODO: Firebase update?
  }

  rechargeAllRecurring(squadronNum: any) {
    let squadron = this.squadrons[squadronNum];
    let recoverCharges = (obj) => {
      if ("charges" in obj) {
        let ffg = obj.ffg;
        if ("side" in obj) {
          ffg = obj.sides[obj.side].ffg;
        }
        let chargeStat = this.dataService.getFFGCardStat(ffg, "charge");
        if (chargeStat.recurring) {
          let maxCharges = chargeStat.value;
          obj.charges += 1;
          if (obj.charges > maxCharges) {
            obj.charges = maxCharges;
          }
        }
      }
    }

    squadron.pilots.forEach(
      (pilot) => {
        if ("force" in pilot) {
          let maxForce = this.dataService.getStatTotal(pilot, "force");
          pilot.force += 1;
          if (pilot.force > maxForce) {
            pilot.force = maxForce;
          }
        }
        recoverCharges(pilot);
        pilot.upgrades.forEach(
          (upgrade) => {
            recoverCharges(upgrade);
          }
        )
      }
    );
    this.snapshot();
  }

  async snapshot() {
    if(this.snapshots.length >= 5) {
      this.snapshots.shift();
    }
    this.snapshots.push({ time: new Date().toISOString(), 
                          squadrons: JSON.parse(JSON.stringify(this.squadrons))});
    this.storage.set("snapshots", this.snapshots);
    console.log("snapshot created", this.snapshots);
    const toast = await this.toastController.create({
      message: "Snapshot created " + this.getLastSnapshotTime(),
      duration: 2000,
      position: 'bottom'
    });
    return toast.present();
  }

  snapshotCheck() {
    if (this.snapshots.length) {
      let lastSnapshot = this.snapshots[this.snapshots.length - 1];
      if (JSON.stringify(lastSnapshot.squadron) != JSON.stringify(this.squadrons)) {
        this.snapshot();
      }
    }
  }  

  undo() {
    this.snapshots.pop();
    let snapshot = this.snapshots.pop();
    this.squadrons = snapshot.squadrons;
    this.snapshot();
    return snapshot.time;
  }

  addSquadron(squadron: any) {
    squadron.damagedeck = this.dataService.getDamageDeck();
    squadron.damagediscard = [ ];
    this.squadrons.push(squadron);
    let squadronNum = this.squadrons.length - 1;
    squadron.squadronNum = squadronNum;
    this.shuffleDamageDeck(squadronNum);
    this.initialized = true;
    console.log("Squadron added", squadron);
    this.snapshot();
  }

  async shuffleDamageDeck(squadronNum: any) {
    let squadron = this.squadrons[squadronNum];
    let newDeck = [ ];
    while (squadron.damagedeck.length > 0) {
      let index = Math.floor(Math.random() * squadron.damagedeck.length);
      let card = squadron.damagedeck[index];
      squadron.damagedeck.splice(index, 1);
      newDeck.push(card);
    }
    squadron.damagedeck = newDeck;
    console.log("Damage deck shuffled", squadron.damagedeck);
    this.snapshot();
    const toast = await this.toastController.create({
      message: "Damage Deck shuffled",
      duration: 2000,
      position: 'top'
    });
    return toast.present();
  }

  shuffleDamageDiscard(squadronNum: number) {
    let squadron = this.squadrons[squadronNum];
    squadron.damagediscard.forEach(
      (card) => {
        squadron.damagedeck.push(card);
      }
    )
    squadron.damagediscard = [ ];
    this.shuffleDamageDeck(squadron);
  }

  discard(squadronNum: any, card: any) {
    let squadron = this.squadrons[squadronNum];
    squadron.damagediscard.push(card);
  }

  draw(squadronNum: any) {
    let squadron = this.squadrons[squadronNum];
    return squadron.damagedeck.shift();
  }

  drawHit(squadronNum: any, pilot: any) {
    let squadron = this.squadrons[squadronNum];
    let card = squadron.damagedeck.shift();
    if (card) {
      card.exposed = false;
      pilot.damagecards.push(card);
      return true;
    } else {
      return false;
    }
  }

  drawCrit(squadronNum: any, pilot: any) {
    let squadron = this.squadrons[squadronNum];
    let card = squadron.damagedeck.shift();
    if (card) {
      card.exposed = true;
      pilot.damagecards.push(card);
      return true;
    } else {
      return false;
    }
  }
}
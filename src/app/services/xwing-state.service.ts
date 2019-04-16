import { Injectable } from '@angular/core';
import { XwingDataService } from './xwing-data.service';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { NgZone } from '@angular/core';

import * as uuidv4 from 'uuid/v4';

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
              public toastController: ToastController,
              public zone: NgZone) {
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

  resetSquadron(uuid: string) {
    let squadron = this.getSquadron(uuid);
    squadron.pointsDestroyed = 0;
    squadron.damagediscard = [ ];
    squadron.damagedeck = this.dataService.getDamageDeck();
    this.shuffleDamageDeck(uuid);
    squadron.pilots.forEach(
      (pilot) => {
        pilot.damagecards = [ ];
        pilot.conditions = [ ];
        if ("shields" in pilot) {
          pilot.shields = this.dataService.getStatTotal(pilot, "shields");
        }
        if ("force" in pilot) {
          pilot.force = this.dataService.getStatTotal(pilot, "force");
        }
        if ("charges" in pilot) {
          let chargeStat = this.dataService.getFFGCardStat(pilot.ffg, "charge");
          pilot.charges = chargeStat.value;
        }
        pilot.upgrades.forEach(
          (upgrade) => {
            upgrade.side = 0;
            if ("charges" in upgrade) {
              let chargeStat = this.dataService.getFFGCardStat(upgrade.sides[0].ffg, "charge");
              upgrade.charges = chargeStat.value
            }
          }
        )
      }
    )
    this.snapshot();
  }

  getPilot(squadronUUID: string, pilotUUID: string) {
    let squadron = this.getSquadron(squadronUUID);
    return squadron.pilots.find(pilot => pilot.uuid == pilotUUID); 
  }

  getUpgrade(squadronUUID: string, pilotUUID: any, upgradeFFG: number) {
    let pilot = this.getPilot(squadronUUID, pilotUUID);
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

  getSquadronPointsDestroyed(uuid: string) {
    let squadron = this.getSquadron(uuid);
    let points = 0;
    squadron.pilots.forEach(
      (pilot) => {
        points += this.dataService.getPointsDestroyed(pilot);
      }
    )
    return points;
  }

  getSquadronPointTotal(uuid: string) {
    let squadron = this.getSquadron(uuid);
    let points = 0;
    squadron.pilots.forEach(
      (pilot) => {
        points += this.dataService.getPilotPoints(pilot);
      }
    )
    return points;
  }

  rechargeAllRecurring(squadronUUID: string) {
    let squadron = this.getSquadron(squadronUUID);
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
        pilot.upgrades = JSON.parse(JSON.stringify(pilot.upgrades));
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
      if (JSON.stringify(lastSnapshot.squadrons) != JSON.stringify(this.squadrons)) {
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

  getSquadronId() {
    return uuidv4();
  }

  getSquadron(uuid: string) {
    return this.squadrons.find(
      (squadron) => squadron.uuid.includes(uuid)
    )
  }

  getSquadronIndex(uuid: string) {
    for (let i = 0; i < this.squadrons.length; i++) {
      if (this.squadrons[i].uuid.includes(uuid)) {
        return i;
      }
    }
    return -1;
  }

  addSquadron(squadron: any) {
    squadron.damagedeck = this.dataService.getDamageDeck();
    squadron.damagediscard = [ ];
    squadron.pilots.forEach(
      (pilot) => {
        pilot.uuid = uuidv4().substring(0, 8);
      }
    )
    squadron.uuid = this.getSquadronId();
    this.squadrons.push(squadron);
    this.shuffleDamageDeck(squadron.uuid);
    this.initialized = true;
    console.log("Squadron added", squadron);
    this.snapshot();
    return squadron;
  }

  async shuffleDamageDeck(squadronUUID: string) {
    let squadron = this.getSquadron(squadronUUID);
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
      position: 'bottom'
    });
    return toast.present();
  }

  shuffleDamageDiscard(squadronUUID: string) {
    let squadron = this.getSquadron(squadronUUID);
    squadron.damagediscard.forEach(
      (card) => {
        squadron.damagedeck.push(card);
      }
    )
    squadron.damagediscard = [ ];
    this.shuffleDamageDeck(squadron);
  }

  discard(squadronUUID: string, card: any) {
    let squadron = this.getSquadron(squadronUUID);
    squadron.damagediscard.push(card);
  }

  draw(squadronUUID: string) {
    let squadron = this.getSquadron(squadronUUID);
    return squadron.damagedeck.shift();
  }

  drawHit(squadronUUID: string, pilotUUID: string) {
    let squadron = this.getSquadron(squadronUUID);
    let pilot = this.getPilot(squadronUUID, pilotUUID);
    let card = squadron.damagedeck.shift();
    if (card) {
      card.exposed = false;
      pilot.damagecards.push(card);
      return true;
    } else {
      return false;
    }
  }

  drawCrit(squadronUUID: string, pilotUUID: string) {
    let squadron = this.getSquadron(squadronUUID);
    let pilot = this.getPilot(squadronUUID, pilotUUID);
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
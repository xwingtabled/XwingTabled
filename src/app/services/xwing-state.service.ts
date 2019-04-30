import { Injectable } from '@angular/core';
import { XwingDataService } from './xwing-data.service';
import { Events, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { firestore } from 'firebase/app'
import * as uuidv4 from 'uuid/v4';


export interface DamageCard {
  title?: string,
  exposed: boolean
}

export interface UpgradeSide {
  ffg: number
}

export interface Upgrade {
  side: number,
  charges?: number,
  sides: UpgradeSide[ ]
}

export interface Pilot {
  conditions: any[ ],
  damagecards: DamageCard[ ],
  ffg: number,
  idNumber: string | number,
  shields?: number,
  charges?: number,
  force?: number,
  upgrades: any [ ],
  uuid: string
}
export interface Squadron {
  damagedeck: DamageCard[ ],
  damagediscard: DamageCard[ ],
  faction: string,
  name: string,
  pilots: Pilot[ ],
  timestamp: number,
  uid: string,
  uuid: string,
}

export interface SquadronMap {
  [uuid: string]: Squadron
}

export interface SnapshotMap {
  [uuid: string]: Squadron[ ]
}

@Injectable({
  providedIn: 'root'
})
export class XwingStateService {
  public initialized: boolean = false;
  public squadrons: SquadronMap;
  public snapshots: SnapshotMap;
  public topic: string = "state:update";
  public currentSquadronUUID: string = null;

  constructor(public dataService: XwingDataService,
              private events: Events,
              private storage: Storage,
              public toastController: ToastController,
              public zone: NgZone,
              public loadingCtrl: LoadingController) {
  }

  reset() {
    this.squadrons = { };
    this.snapshots = { };
    this.initialized = false;
    this.notify();
  }

  async restoreFromDisk() {
    await this.storage.ready();
    this.squadrons = await this.storage.get("squadrons");
    if (!this.squadrons) {
      this.squadrons = { }
      console.log("No local squadrons found");
      this.initialized = false;
      this.notify();
      return;
    }
    console.log("Squadrons restored", this.squadrons);
    this.initialized = true;
    this.notify();
  }

  getTimestamp() {
    return Math.ceil(Date.now() / 1000);
  }

  getLastSnapshotTime(uuid: string) : number {
    let snapshots = this.snapshots[uuid];
    return snapshots[snapshots.length - 1].timestamp;
  }

  resetSquadron(uuid: string) {
    let squadron = this.getSquadron(uuid);
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
    this.snapshot(uuid);
    this.notify([ uuid ]);
  }

  updateSquadron(incomingSquadron: Squadron) {
    let squadron: Squadron = this.getSquadron(incomingSquadron.uuid);
    if (!squadron) {
      return;
    }
    if (squadron.timestamp + 2 > incomingSquadron.timestamp) {
      return;
    }
    this.squadrons[incomingSquadron.uuid] = incomingSquadron;
    this.snapshot(incomingSquadron.uuid);
    this.notify([ incomingSquadron.uuid ]);
  }

  closeSquadron(uuid: string) {
    let destination = null;
    delete this.squadrons[uuid];
    delete this.snapshots[uuid];
    this.notify([ uuid ]);
  }

  notify(uuids: string[] = []) {
    if (uuids.length == 0 && this.squadrons) {
      Object.keys(this.squadrons).forEach(
        (uuid) => {
          uuids.push(uuid);
        }
      )
    }
    this.events.publish(this.topic, uuids);
  }

  getDamageCard(squadronUUID: string, pilotUUID: string, cardIndex: number) : DamageCard {
    return this.getPilot(squadronUUID, pilotUUID).damagecards[cardIndex];
  }

  getCondition(squadronUUID: string, pilotUUID: string, cardIndex: number) {
    return this.getPilot(squadronUUID, pilotUUID).conditions[cardIndex];
  }

  getPilot(squadronUUID: string, pilotUUID: string) : Pilot {
    let squadron = this.getSquadron(squadronUUID);
    if (!squadron) {
      return null;
    }
    return squadron.pilots.find(pilot => pilot.uuid == pilotUUID); 
  }

  getUpgrade(squadronUUID: string, pilotUUID: any, upgradeFFG: number) : Upgrade {
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

  getSquadronPointsDestroyed(uuid: string) : number {
    let squadron = this.getSquadron(uuid);
    let points = 0;
    squadron.pilots.forEach(
      (pilot) => {
        points += this.dataService.getPointsDestroyed(pilot);
      }
    )
    return points;
  }

  getSquadronPointTotal(uuid: string) : number {
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
    this.snapshot(squadronUUID);
  }

  async snapshot(uuid: string) {
    this.snapshots[uuid].push(
      JSON.parse(JSON.stringify(this.squadrons[uuid]))
    )
    let dateString = new Date(this.squadrons[uuid].timestamp * 1000).toDateString();
    const toast = await this.toastController.create({
      message: "Snapshot created " + dateString,
      duration: 2000,
      position: 'bottom'
    });
    return toast.present();
  }

  undo(uuid: string) : number {
    this.snapshots[uuid].pop();
    let snapshot: Squadron = this.snapshots[uuid].pop();
    this.squadrons[uuid] = snapshot;
    this.snapshot(uuid);
    this.notify([ uuid ]);
    return snapshot.timestamp;
  }

  getSquadronId() {
    return uuidv4();
  }

  getSquadron(uuid: string) : Squadron {
    return this.squadrons[uuid];
  }

  importSquadron(squadron: Squadron) {
    this.squadrons[squadron.uuid] = squadron;
    this.snapshots[squadron.uuid] = [ ];
    this.initialized = true;
    this.snapshot(squadron.uuid);
  }

  addSquadron(squadron: Squadron) {
    squadron.damagedeck = this.dataService.getDamageDeck();
    squadron.damagediscard = [ ];

    // TODO: what is in the struct being received?
    squadron.pilots.forEach(
      (pilot) => {
        pilot.uuid = uuidv4().substring(0, 8);
      }
    )
    squadron.uuid = this.getSquadronId();
    squadron.timestamp = this.getTimestamp();
    this.importSquadron(squadron);
    this.shuffleDamageDeck(squadron.uuid);
    this.initialized = true;
    this.notify([ squadron.uuid ]);
    console.log("Squadron added", squadron);
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
    this.snapshot(squadron.uuid);
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
    this.shuffleDamageDeck(squadron.uuid);
  }

  discard(squadronUUID: string, card: DamageCard) {
    let squadron = this.getSquadron(squadronUUID);
    squadron.damagediscard.push(card);
  }

  draw(squadronUUID: string) : DamageCard {
    let squadron = this.getSquadron(squadronUUID);
    return squadron.damagedeck.shift();
  }

  drawHit(squadronUUID: string, pilotUUID: string) : DamageCard {
    let squadron = this.getSquadron(squadronUUID);
    let pilot = this.getPilot(squadronUUID, pilotUUID);
    let card = squadron.damagedeck.shift();
    if (card) {
      card.exposed = false;
      pilot.damagecards.push(card);
      return card;
    } else {
      return null;
    }
  }

  drawCrit(squadronUUID: string, pilotUUID: string) : DamageCard {
    let squadron = this.getSquadron(squadronUUID);
    let pilot = this.getPilot(squadronUUID, pilotUUID);
    let card = squadron.damagedeck.shift();
    if (card) {
      card.exposed = true;
      pilot.damagecards.push(card);
      return card;
    } else {
      return null;
    }
  }
}
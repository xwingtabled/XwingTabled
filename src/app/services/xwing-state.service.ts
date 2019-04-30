import { Injectable } from '@angular/core';
import { XwingDataService } from './xwing-data.service';
import { Events, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { firestore } from 'firebase/app'
import * as uuidv4 from 'uuid/v4';
import { FirebaseService } from './firebase.service';
import { DocumentSnapshot} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  idNumber?: string | number,
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
  public squadrons: SquadronMap = { };
  public snapshots: SnapshotMap = { };
  private subscriptions: { [key: string] : Observable<Squadron> } = { };
  public topic: string = "state:update";
  public currentSquadronUUID: string = null;

  constructor(public dataService: XwingDataService,
              private events: Events,
              private storage: Storage,
              public toastController: ToastController,
              public zone: NgZone,
              public loadingCtrl: LoadingController,
              private firebase: FirebaseService) {
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
    Object.keys(this.squadrons).forEach(
      (uuid) => {
        this.snapshots[uuid] = [ JSON.parse(JSON.stringify(this.squadrons[uuid])) ];
      }
    )
    console.log("Squadrons restored", this.squadrons);
    this.initialized = true;
    this.notify();
  }

  nextSquadron(uuid: string) : string {
    if (!this.squadrons[uuid]) {
      return null;
    }

    let uuids = Object.keys(this.squadrons);
    let index = uuids.indexOf(uuid) + 1;
    if (index > uuids.length) {
      return null;
    }
    return uuids[index];
  }

  previousSquadron(uuid: string) : string {
    if (!this.squadrons[uuid]) {
      return null;
    }

    let uuids = Object.keys(this.squadrons);
    let index = uuids.indexOf(uuid) - 1;
    if (index > uuids.length) {
      return null;
    }
    return uuids[index];
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

  updateSquadron(uuid: string, incomingSquadron: Squadron) {
    let squadron: Squadron = this.getSquadron(uuid);
    if (!incomingSquadron) {
      this.closeSquadron(uuid);
      return;
    }
    if (!squadron) {
      return;
    }
    if (squadron.timestamp + 2 > incomingSquadron.timestamp) {
      return;
    }
    this.squadrons[uuid] = incomingSquadron;
    this.snapshot(uuid);
    this.notify([ uuid ]);
  }

  closeSquadron(uuid: string) {
    delete this.squadrons[uuid];
    delete this.snapshots[uuid];
    delete this.subscriptions[uuid];
    this.storage.set("squadrons", this.squadrons);
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

  async subscribe(uuid: string) {
    this.subscriptions[uuid] = await this.firebase.getSquadronSubscription(uuid);
    this.subscriptions[uuid].subscribe(
      (squadron) => {
        this.updateSquadron(uuid, squadron);
      }
    )
  }

  async synchronize() {
    const loading = await this.loadingCtrl.create({
      message: "Looking for squadron online"
    });
    await loading.present();
    Object.keys(this.squadrons).forEach(
      async (uuid) => {
        try {
          let squadron: Squadron = await this.firebase.retrieveSquadron(uuid);
          if (squadron) {
            this.updateSquadron(uuid, squadron);
          } else {
            await this.firebase.pushSquadron(uuid, squadron);
          }
          await this.subscribe(uuid);
        } catch (err) {
          console.log("Unable to sync squadron", uuid, err);
        }
      }
    )
    return await this.loadingCtrl.dismiss()
  }

  async snapshot(uuid: string) {
    this.snapshots[uuid].push(
      JSON.parse(JSON.stringify(this.squadrons[uuid]))
    )
    this.storage.set("squadrons", this.squadrons);
    await this.firebase.pushSquadron(uuid, this.squadrons[uuid]);
    let dateString = new Date(this.squadrons[uuid].timestamp * 1000).toString();
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
    let oldTimestamp = snapshot.timestamp;
    snapshot.timestamp = this.getTimestamp();
    this.squadrons[uuid] = JSON.parse(JSON.stringify(snapshot));
    this.snapshot(uuid);
    this.notify([ uuid ]);
    return oldTimestamp;
  }

  getSquadronId() {
    return uuidv4();
  }

  getSquadron(uuid: string) : Squadron {
    return this.squadrons[uuid];
  }

  async importSquadron(uuid: string, squadron: Squadron) {
    this.squadrons[uuid] = squadron;
    this.snapshots[uuid] = [ ];
    this.initialized = true;
    await this.snapshot(uuid);
    return await this.subscribe(uuid);
  }

  async addSquadron(uuid: string, squadron: Squadron) {
    squadron.damagedeck = this.dataService.getDamageDeck();
    squadron.damagediscard = [ ];
    squadron.timestamp = this.getTimestamp();
    await this.importSquadron(uuid, squadron);
    this.shuffleDamageDeck(uuid);
    this.initialized = true;
    this.notify([ uuid ]);
    console.log("Squadron added", squadron);
    return squadron;
  }

  async shuffleDamageDeck(uuid: string) {
    let squadron: Squadron = this.getSquadron(uuid);
    let newDeck: DamageCard[ ] = [ ];
    while (squadron.damagedeck.length > 0) {
      let index = Math.floor(Math.random() * squadron.damagedeck.length);
      let card: DamageCard = squadron.damagedeck[index];
      squadron.damagedeck.splice(index, 1);
      newDeck.push(card);
    }
    squadron.damagedeck = newDeck;
    this.snapshot(uuid);
    const toast = await this.toastController.create({
      message: "Damage Deck shuffled",
      duration: 2000,
      position: 'bottom'
    });
    return toast.present();
  }

  shuffleDamageDiscard(uuid: string) {
    let squadron = this.getSquadron(uuid);
    squadron.damagediscard.forEach(
      (card) => {
        squadron.damagedeck.push(card);
      }
    )
    squadron.damagediscard = [ ];
    this.shuffleDamageDeck(uuid);
  }

  discard(uuid: string, card: DamageCard) {
    let squadron = this.getSquadron(uuid);
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
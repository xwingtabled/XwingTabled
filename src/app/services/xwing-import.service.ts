import { Injectable } from '@angular/core';
import { XwingDataService } from './xwing-data.service';
import { XwingStateService, Squadron, Pilot, Upgrade } from './xwing-state.service';
import { FirebaseService } from './firebase.service';
import { HttpProvider } from '../providers/http.provider';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as uuidv4 from 'uuid/v4';
@Injectable({
  providedIn: 'root'
})
export class XwingImportService {
  public qrData: string = "";
  
  constructor(public dataService: XwingDataService,
              public state: XwingStateService,
              private http: HttpProvider,
              private modalController: ModalController,
              private toastController: ToastController,
              private router: Router,
              private firebase: FirebaseService) {
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
                if (upgradeType == "force" || upgradeType == "force-power") {
                  upgradeType = "forcepower";
                }
                // Skip hardpoints on T70s for xws exports from raithos.github.io
                if (upgradeType == "hardpoint") {
                  return;
                }
                let upgradeData = this.dataService.getUpgrade(upgradeType, upgradeName);
                if (upgradeData != null) {
                  upgradeData['type'] = upgradeType;
                  mangledUpgrades.push(upgradeData);
                } else {
                  throw "ERROR: Upgrade not found - " + upgradeName;
                }
              }
            )
          }
        }
      );
    }
    pilot.upgrades = mangledUpgrades;
  }

  getUpgradeStateObject(upgrade: any) : Upgrade {
    let upgradeData: Upgrade = {
      side: 0,
      sides: [ ]
    };
    if (upgrade.sides[0].charges) {
      upgradeData["charges"] = upgrade.sides[0].charges.value;
    }
    upgrade.sides.forEach(
      (side) => {
        upgradeData.sides.push({ ffg: side.ffg })
      }
    )
    return upgradeData;
  }

  getPilotStateObject(pilot: any, faction: string) : Pilot {
    let xwsPilotData = this.dataService.getPilot(faction, pilot.ship, pilot.id);
    let pilotData: Pilot = {
      ffg: xwsPilotData.ffg,
      upgrades: [ ],
      damagecards: [ ],
      conditions: [ ],
      uuid: uuidv4().substring(0, 8)
    }
    return pilotData;
  }

  injectBonuses(pilotData: any) {
    let chargeStat = this.dataService.getFFGCardStat(pilotData.ffg, "charge");
    if (chargeStat) {
      pilotData["charges"] = parseInt(chargeStat.value);
    }
    let stats = [ "force", "shields" ];
    stats.forEach(
      (stat) => {
        let statTotal = this.dataService.getStatTotal(pilotData, stat);
        if (statTotal > 0) {
          pilotData[stat] = statTotal;
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
        if (upgrade.cost) {
          if ("value" in upgrade.cost) {
            upgradeCost += upgrade.cost.value;
          }
          if ("variable" in upgrade.cost) {
            let statValue = "";
            upgrade.cost.variable = upgrade.cost.variable.toLowerCase();
            if (upgrade.cost.variable == "size") {
              statValue = pilot.ship.size;
            } else if (upgrade.cost.variable == "initiative") {
              statValue = pilot.pilot.initiative;
            } else {
              statValue = pilot.stats.find((stat) => stat.type == upgrade.cost.variable).value;
            }
            upgradeCost += upgrade.cost.values[statValue];
          }
        }
      }
    );
    pilot.points = pilotCost + upgradeCost;
  }

  convertFFG(data: any) : Squadron {
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
    return this.processXws(squadron);
  }

  processYasb(data: any) : Squadron {
    let pilots = [ ];
    data.pilots.forEach(
      (pilot) => {
        let yasbPilot = this.dataService.getYasbPilot(pilot.id);
        let xwsPilot = { id: yasbPilot.xws, ship: yasbPilot.ship, upgrades: { } };
        let upgrades = { };
        for (let i = 0; i < pilot.upgrades.length; i++) {
          let upgrade = pilot.upgrades[i];
          let hardpointRegex = /\d{3}(\:U\.\-?\d+)/g
          let hardpoints = upgrade.match(hardpointRegex);
          let upgradeNum = -1;
          if (hardpoints && hardpoints[0]) {
            upgradeNum = parseInt(hardpoints[0].split('.')[1]);
            // Upgrade number that grants another slot - push to the end
            let baseUpgradeNum = hardpoints[0].split(':')[0];
            pilot.upgrades.push(baseUpgradeNum)
          } else {
            upgradeNum = parseInt(upgrade);
          }
          let yasbUpgrade = this.dataService.getYasbUpgrade(upgradeNum);
          if (yasbUpgrade) {
            if (upgrades[yasbUpgrade.slot] == undefined) {
              upgrades[yasbUpgrade.slot] = [ ];
            }
            upgrades[yasbUpgrade.slot].push(yasbUpgrade.xws);
          }
        }
        xwsPilot.upgrades = upgrades;
        pilots.push(xwsPilot);
      }
    )
    let squadron = {
      name: data.name,
      faction: data.faction,
      pilots: pilots
    };
    return this.processXws(squadron);
  }

  applyXwsShims(squadron: any) {
    squadron.pilots.forEach(
      (pilot) => {
        let pilotShim = this.dataService.data.shims.xwsPilot[pilot.id];
        if (pilotShim) {
          console.log("Shim applied:", pilot.id, "=>", pilotShim);
          pilot.id = pilotShim;
          pilot.name = pilotShim;
        }
        let shipShim = this.dataService.data.shims.xwsShip[pilot.ship];
        if (shipShim) {
          console.log("Shim applied:", pilot.ship, "=>", shipShim);
          pilot.ship = shipShim;
        }
        pilot.upgrades.forEach(
          (upgrade) => {
            let upgradeShim = this.dataService.data.shims.xwsUpgrade[upgrade.xws];
            if (upgradeShim) {
              console.log("Shim applied:", upgrade.xws, "=>", upgradeShim);
              upgrade.xws = upgradeShim;
            }
          }
        )
      }
    )
  }

  processXws(squadron: any) : Squadron {
    let squadPoints = 0;
    let squadronData : Squadron = {
      name: squadron.name,
      faction: squadron.faction,
      damagediscard: [ ],
      damagedeck: this.dataService.getDamageDeck(),
      pilots: [ ],
      timestamp: this.state.getTimestamp(),
      uid: null
    }

    // Transform upgrade array in xws data source to 
    // make it easier to grab data
    squadron.pilots.forEach(
      (pilot) => {
        this.mangleUpgradeArray(pilot);
      }
    )
    squadron.pilots.forEach(
      (pilot) => {
        // Generate a pilot object
        if (!pilot.id) {
          pilot.id = pilot.name;
        }
        let pilotData: Pilot = this.getPilotStateObject(pilot, squadron.faction);

        this.applyXwsShims(squadron);
        // Process xws data source pilot
        pilot.upgrades.forEach(
          (upgrade) => {
            pilotData.upgrades.push(this.getUpgradeStateObject(upgrade))
          }
        );

        this.injectBonuses(pilotData);

        squadronData.pilots.push(pilotData);
      }
    )

    // Assign ID tokens and enumerate pilots
    for (let i = 0; i < squadronData.pilots.length; i++) {
      squadronData.pilots[i].idNumber = i + 1;
    }

    return squadronData;
  }

  async processXwingTabled(uuid: string) : Promise<Squadron> {
    try {
      let squadron = this.firebase.retrieveSquadron(uuid);
      return squadron;
    } catch (error) {
      console.log("Unable to get X-Wing Tabled Squadron Data", error);
      const toast = await this.toastController.create({
        message: "ERROR: Unable to retrieve X-Wing Tabled Squadron",
        duration: 5000,
        position: 'bottom'
      });
      toast.present(); 
      return error;
    }
  }

  async processFFG(uuid: string) : Promise<Squadron> {
    let url = "https://squadbuilder.fantasyflightgames.com/api/squads/" + uuid + "/";
    try {
      let squadron = await this.http.get(url).toPromise();
      return this.convertFFG(squadron);
    } catch (error) {
      console.log("Unable to get FFG SquadBuilder data", error);
      const toast = await this.toastController.create({
        message: "ERROR: Unable to load FFG Squad",
        duration: 5000,
        position: 'bottom'
      });
      toast.present(); 
      throw error;
    }
  }
}
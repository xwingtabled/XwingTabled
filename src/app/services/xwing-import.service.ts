import { Injectable } from '@angular/core';
import { XwingDataService } from './xwing-data.service';
import { HttpProvider } from '../providers/http.provider';

@Injectable({
  providedIn: 'root'
})
export class XwingImportService {
  constructor(public dataService: XwingDataService,
              private http: HttpProvider) {
  }

  injectShipData(pilot: any, faction: string) {
    // Inject ship data into pilot
    let xwsShip = pilot.ship;
    pilot.ship = this.dataService.getShip(faction, pilot.ship);
    if (pilot.ship != null) {
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
    } else {
      throw "ERROR: Ship not found - " + xwsShip;
    }
  }


  injectPilotData(pilot: any, faction: string) {
    // Get pilot data and insert it into pilot object
    pilot.pilot = this.dataService.getPilot(faction, pilot.ship.keyname, pilot.id);
    if (pilot.pilot != null) {
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

      pilot.card_text = "";
      if (pilot.pilot.ability) {
        pilot.card_text += pilot.pilot.ability + "<br /><br />";
      }
      if (pilot.pilot.text) {
        pilot.card_text += pilot.pilot.text + "<br /><br />";
      }
      if (pilot.pilot.shipAbility && pilot.pilot.shipAbility.text) {
        pilot.card_text += "<i>" + pilot.pilot.shipAbility.name + "</i>: " +
                          pilot.pilot.shipAbility.text;
      }

      // Add additional game state variables
      pilot.damagecards = []; 
      pilot.conditions = [];
      pilot.pointsDestroyed = 0;
    } else {
      throw "ERROR: Pilot not found - " + pilot.id;
    }
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

  injectUpgradeData(pilot: any, upgrade: any) {
    // Set default "side" of upgrade card to side 0
    upgrade.side = 0;

    // Process each side
    upgrade.sides.forEach(
      (side) => {
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

        // If side has granted actions that aren't listed as actions, 
        // inject those
        if (!side.actions) {
          side.actions = [ ];
          if (side.grants) {
            side.grants.forEach(
              (grant) => {
                if (grant['type'] == "action") {
                  side.actions.push(grant.value);
                }
              }
            )
          }
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
            if (!stat) {
              stat = {
                "type": grant.value,
                "remaining": grant.amount,
                "value": grant.amount
              };
              pilot.stats.push(stat);
            } else {
              stat.value += grant.amount;
              stat.remaining = stat.value; 
            }
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
        if (upgrade.cost) {
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
      }
    );
    pilot.points = pilotCost + upgradeCost;
  }

  processFFG(data: any) {
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
    return this.processXws(squadron);
  }

  processYasb(data: any) {
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
    console.log("YASB squadron", squadron);
    return this.processXws(squadron);
  }

  processXws(squadron: any) {
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
    return squadron;
  }
}
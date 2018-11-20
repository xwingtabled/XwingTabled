import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';

@Component({
  selector: 'xws-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  @Input() pilot: any;
  @Input() faction: string;
  img_url: string = "";
  shipData: any;
  pilotData: any;

  constructor(public dataService: XwingDataService) { }

  injectShipData() {
    this.pilot.ship = this.dataService.getShip(this.faction, this.pilot.ship);

    this.pilot.ship.stats.forEach(
      (stat) => {
        if (stat['type'] == 'hull') {
          this.pilot['hull'] = { value: stat.value, remaining: stat.value };
        }
        if (stat['type'] == 'shields') {
          this.pilot['shields'] = { value: stat.value, remaining: stat.value }; 
        }
      }
    )
  }

  injectPilotData() {
    this.pilot.pilot = this.dataService.getPilot(this.faction, this.pilot.ship.xws, this.pilot.name);
    // Prevent hotloading of a pilot image URL if we can load its base64url instead
    let img_url = this.pilot.pilot.image;
    this.pilot.image = "";
    this.dataService.get_image_by_url(img_url).then(
      base64url => {
        this.pilot.image = base64url;
      }
    );
    // Copy charge data to pilot object root
    if (this.pilot.pilot.charges) {
      this.pilot.charges = JSON.parse(JSON.stringify(this.pilot.pilot.charges));
      if (this.pilot.charges.remaining == undefined) {
        this.pilot.charges.remaining = this.pilot.charges.value;
        this.pilot.charges.numbers = Array(this.pilot.charges.recovers);
      }
    }
    // Copy force data to pilot object root
    if (this.pilot.pilot.force) {
      this.pilot.force = JSON.parse(JSON.stringify(this.pilot.pilot.force));
      this.pilot.force.remaining = this.pilot.force.value;
      this.pilot.force.numbers = Array(this.pilot.force.recovers);
    }
  }

  mangleUpgradeArray() {
    let mangledUpgrades = [ ];
    Object.entries(this.pilot.upgrades).forEach(
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
    this.pilot.upgrades = mangledUpgrades;
  }

  injectUpgradeData(upgrade: any) {
    // Set default "side" of upgrade card to side 0
    upgrade.side = 0;

    // Process each side
    upgrade.sides.forEach(
      (side) => {
        // Prevent loading of upgrade image if we could load base64url instead
        let img_url = side.image;
        side.image = "";
        this.dataService.get_image_by_url(img_url).then(
          (base64url) => {
            side.image = base64url;
          }
        );
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

  injectShipBonuses() {
    this.pilot.upgrades.forEach(
      (upgrade) => {
        let side = upgrade.sides[0];
        if (side.grants) {
          side.grants.forEach(
            (grant) => {
              if (grant.value == "shields" || grant.value == "hull") {
                this.pilot[grant.value].value += grant.amount;
                this.pilot[grant.value].remaining = this.pilot[grant.value].value;
              }
            }
          )
        }
      }
    )
  }

  injectForceBonuses() {
    this.pilot.upgrades.forEach(
      (upgrade) => {
        let side = upgrade.sides[0];
        if (side.force) {
          if (!this.pilot.force) {
            this.pilot.force = { value: 0, recovers: 0, numbers: [] }
          }
          this.pilot.force.value += side.force.value;
          this.pilot.force.recovers += side.force.recovers;
          this.pilot.force.numbers = Array(this.pilot.force.recovers);
        }
      }
    )
  }

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
    this.injectShipData();
    this.injectPilotData();
    this.mangleUpgradeArray();

    let upgradeForceValue = 0;
    let upgradeForceRecover = 0;
    // Process each upgrade card
    this.pilot.upgrades.forEach(
      (upgrade) => {
        this.injectUpgradeData(upgrade);
      }
    );
    this.injectShipBonuses();
    this.injectForceBonuses();
    this.pilot.conditions = [];
    console.log(this.pilot);
  }

  showPilot() {
    console.log(this.pilot);
  }

}

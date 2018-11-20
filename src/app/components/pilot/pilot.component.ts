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

  ngOnInit() {
    /* Mangles pilot data:
    pilot:
      id: <string>,
      name: <string>,

      pilot: <PilotData>
        {
          image: base64url (or hotlinked url),
        },
      ship: <ShipData>
      upgrades: <UpgradeData>[]
        [
          {
            type: <string>
            sides: <SideData>[]
              [
                {
                  image: base64url (or hotlinked url),
                  charges: {
                    remaining: value,
                    numbers: [] (for recover icons)
                  },
                  force: {
                    numbers: [] (for recover icons)
                  }
                }
              ]
          }
        ]

    */
    this.pilot.ship = this.dataService.getShip(this.faction, this.pilot.ship);
    this.pilot.pilot = this.dataService.getPilot(this.faction, this.pilot.ship.xws, this.pilot.name);

    // Prevent hotloading of a pilot image URL if we can load its base64url instead
    let img_url = this.pilot.pilot.image;
    this.pilot.pilot.image = "";
    this.dataService.get_image_by_url(img_url).then(
      base64url => {
        this.pilot.pilot.image = base64url;
      }
    )
    let mangledUpgrades = [ ];
    Object.entries(this.pilot.upgrades).forEach(
      ( [upgradeType, upgradeArray ] ) => {
        if (Array.isArray(upgradeArray)) {
          upgradeArray.forEach(
            (upgradeName) => {
              let upgradeData = this.dataService.getUpgrade(upgradeType, upgradeName);
              upgradeData['type'] = upgradeType;
              mangledUpgrades.push(upgradeData);
            }
          )
        }
      }
    );
    this.pilot.upgrades = mangledUpgrades;
    this.pilot.upgrades.forEach(
      (upgrade) => {
        upgrade.side = 0;
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
              if (side.charges.reamining == undefined) {
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
    );
    console.log(this.pilot);
  }

  showPilot() {
    console.log(this.pilot);
  }

}

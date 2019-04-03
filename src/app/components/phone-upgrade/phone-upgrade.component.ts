import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { ModalController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { XwingStateService } from '../../services/xwing-state.service';
import { Router } from '@angular/router';
@Component({
  selector: 'xws-phone-upgrade',
  templateUrl: './phone-upgrade.component.html',
  styleUrls: ['./phone-upgrade.component.scss']
})
export class PhoneUpgradeComponent implements OnInit {
  @Input() pilotNum: number;
  @Input() ffg: number;
  upgrade: any = { };
  sides: any[] = [ ];

  constructor(public dataService: XwingDataService, 
              private modalController: ModalController,
              private events: Events,
              public state: XwingStateService,
              private router: Router) { }

  ngOnInit() {
    this.upgrade = this.state.getUpgradeState(this.pilotNum, this.ffg);
    for (let i = 0; i < this.upgrade.sides.length; i++) {
      this.sides[i] = this.dataService.getCardByFFG(this.upgrade.sides[i].ffg);
    }
  }

  avatar() {
    return this.dataService.getXwsUpgradeType(this.sides[this.upgrade.side].upgrade_types[0]);
  }

  isConfiguration() {
    let configurationUpgradeType = 
      this.dataService.data["upgrade-types"].find((upgradeType) => upgradeType.xws == 'configuration').ffg;
    return this.sides[this.upgrade.side].upgrade_types.includes(configurationUpgradeType);
  }

  showUpgrade() {
    let url = '/pilot/' + this.pilotNum + "/upgrade/" + this.upgrade.sides[this.upgrade.side].ffg; 
    this.router.navigateByUrl(url);
  }
}

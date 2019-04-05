import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { LayoutService } from '../../services/layout.service';
import { UpgradeModalPage } from '../../modals/upgrade-modal/upgrade-modal.page';
import { ModalController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { XwingStateService } from '../../services/xwing-state.service';
@Component({
  selector: 'xws-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  @Input() pilotNum: number;
  @Input() ffg: number;
  upgrade: any = { };
  img_class: string = "img-alt";
  img_urls: string[] = [ "", "" ];
  artwork: boolean = true;
  sides: any[] = [ { } ];
  chargeStat: any = null;
  forceStat: any = null;
  isConfiguration: boolean = false;

  constructor(public dataService: XwingDataService, 
              private modalController: ModalController,
              private events: Events,
              public layout: LayoutService,
              public state: XwingStateService) { }

  async presentUpgradeModal() {
    let stateString = JSON.stringify(this.upgrade);
    const modal = await this.modalController.create({
      component: UpgradeModalPage,
      componentProps: {
        ffg: this.upgrade.sides[this.upgrade.side].ffg,
        pilotNum: this.pilotNum
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (stateString != JSON.stringify(this.upgrade)) {
      this.state.snapshot();
    }
  }

  getIsConfiguration() {
    let configurationUpgradeType = 
      this.dataService.data["upgrade-types"].find((upgradeType) => upgradeType.xws == 'configuration').ffg;
    return this.sides[this.upgrade.side].upgrade_types.includes(configurationUpgradeType);
  }

  ngOnInit() {
    this.upgrade = this.state.getUpgradeState(this.pilotNum, this.ffg);
    for (let i = 0; i < this.upgrade.sides.length; i++) {
      this.sides[i] = this.dataService.getCardByFFG(this.upgrade.sides[i].ffg);
      this.dataService.get_image_by_url(this.sides[i].image).then(
        (url) => {
          this.img_urls[i] = url;
        }
      )
    }
  }

  showOverlay() {
    if ("charges" in this.upgrade) {
      this.chargeStat = this.dataService.getCardStatObject(
        this.upgrade.sides[0].ffg, "charge", this.upgrade.charges
      );
    }
    this.forceStat = this.dataService.getCardStatObject(
      this.upgrade.sides[this.upgrade.side].ffg,
      "force",
      -1
    );
    this.isConfiguration = this.getIsConfiguration();
    return this.chargeStat || 
            this.forceStat || 
            this.isConfiguration || 
            this.sides[this.upgrade.side].grants;
  }

  statClass(grant) {
    if (grant.type == 'action' && grant.value.linked) {
      return "stat-small";
    }
    return  "stat";
  }

  showUpgrade() {
    this.presentUpgradeModal();
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { UpgradeModalPage } from '../../upgrade-modal/upgrade-modal.page';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'xws-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  @Input() upgrade: any = { };
  img_class: string = "img-box";

  constructor(public dataService: XwingDataService, private modalController: ModalController ) { }

  async presentUpgradeModal() {
    const modal = await this.modalController.create({
      component: UpgradeModalPage,
      componentProps: {
        upgrade: this.upgrade
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  ngOnInit() {
    if (this.upgrade['type'] == "configuration") {
      this.img_class = "img-config-box";
    }
  }

  showUpgrade() {
    this.presentUpgradeModal();
  }
}

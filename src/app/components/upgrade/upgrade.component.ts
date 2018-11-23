import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { UpgradeModalPage } from '../../upgrade-modal/upgrade-modal.page';
import { ModalController } from '@ionic/angular';
import { Events } from '@ionic/angular';
@Component({
  selector: 'xws-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  @Input() upgrade: any = { };
  img_class: string = "img-box";
  img_urls: string[] = [ "", "" ];

  constructor(public dataService: XwingDataService, 
              private modalController: ModalController,
              private events: Events) { }

  async presentUpgradeModal() {
    let stateString = JSON.stringify(this.upgrade);
    const modal = await this.modalController.create({
      component: UpgradeModalPage,
      componentProps: {
        upgrade: this.upgrade
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (stateString != JSON.stringify(this.upgrade)) {
      this.events.publish("snapshot", "create snapshot");
    }
  }

  ngOnInit() {
    if (this.upgrade['type'] == "configuration") {
      this.img_class = "img-config-box";
    }
    for (let i = 0; i < this.upgrade.sides.length; i++) {
      this.dataService.get_image_by_url(this.upgrade.sides[i].image).then(
        (url) => {
          this.img_urls[i] = url;
        }
      )
    }
  }

  showUpgrade() {
    this.presentUpgradeModal();
  }
}

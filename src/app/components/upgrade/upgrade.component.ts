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
  @Input() upgrade: any = { };
  img_class: string = "img-alt";
  img_urls: string[] = [ "", "" ];
  artwork: boolean = true;
  sides: any[] = [ { } ];

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
        upgrade: this.upgrade
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (stateString != JSON.stringify(this.upgrade)) {
      this.state.snapshot();
    }
  }

  ngOnInit() {
    for (let i = 0; i < this.upgrade.sides.length; i++) {
      this.sides[i] = this.dataService.getCardByFFG(this.upgrade.sides[i].ffg);
      console.log(this.sides[i]);
      this.dataService.get_image_by_url(this.sides[i].image).then(
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

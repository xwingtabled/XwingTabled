import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { XwsModalPage } from '../xws-modal/xws-modal.page';
import { LoadingPage } from '../loading/loading.page';
import { Router } from '@angular/router';
import { XwingDataService } from '../services/xwing-data.service';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  squadrons: any = [ ];
  constructor(public modalController: ModalController, 
              public dataService: XwingDataService,
              public router: Router,
              public platform: Platform) { }

  ngOnInit() {
    if (!this.dataService.initialized) {
      this.presentLoadingModal();
    }
  }

  portrait() {
    return this.platform.is('mobile') || this.platform.width() < this.platform.height();
  }

  squadronCss() {
    if (this.portrait()) {
      return 'squadron-fullwidth';
    }
    if (this.squadrons.length > 1) { 
      return 'squadron-halfwidth';
    } else {
      return 'squadron-fullwidth';
    }
  }

  pilotCss() {
    if (this.portrait()) {
      return 'squadron-fullwidth';
    }
    if (this.squadrons.length > 1) {
      return 'squadron-fullwidth';
    } else {
      return 'squadron-halfwidth';
    }
  }

  xwsAddButton() {
    this.presentXwsModal();
  }

  async presentXwsModal() {
    const modal = await this.modalController.create({
      component: XwsModalPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.squadrons.push(data);
    }
  }

  async presentLoadingModal() {
    const modal = await this.modalController.create({
      component: LoadingPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }
}

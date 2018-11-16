import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { XwsModalPage } from '../xws-modal/xws-modal.page';
import { LoadingPage } from '../loading/loading.page';
import { Router } from '@angular/router';
import { XwingJsonDataService } from '../services/xwing-json-data.service';
import { XwingImageService } from '../services/xwing-image.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  squadrons: any = [ ];
  constructor(public modalController: ModalController, 
              public dataService: XwingJsonDataService,
              public imageService: XwingImageService,
              public router: Router) { }

  ngOnInit() {
    if (!this.dataService.initialized || !this.imageService.initialized) {
      this.presentLoadingModal();
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

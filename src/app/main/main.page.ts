import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { XwsModalPage } from '../xws-modal/xws-modal.page';
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
      this.router.navigateByUrl('/loading');
    }
  }

  xwsAddButton() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: XwsModalPage,
      componentProps: { value: 123 }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.squadrons.push(data);
  }
}

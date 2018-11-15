import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { XwsModalPage } from '../xws-modal/xws-modal.page';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  squadrons: any = [ ];
  constructor(public modalController: ModalController) { }

  ngOnInit() {
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

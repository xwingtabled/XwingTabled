import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.page.html',
  styleUrls: ['./help-modal.page.scss'],
})
export class HelpModalPage implements OnInit {

  cloudSquadrons: any[] = [];
  currentSquadronUUID: string = null;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
   
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

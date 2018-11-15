import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-xws-modal',
  templateUrl: './xws-modal.page.html',
  styleUrls: ['./xws-modal.page.scss'],
})
export class XwsModalPage implements OnInit {

  xwsData: any = null;
  okDisabled: boolean = true;

  constructor(public modal: ModalController) { }

  ngOnInit() {
  }

  textChange($event) {
    try {
      this.xwsData = JSON.parse($event.detail.value);
      this.okDisabled = false;
    } catch(error) {
      this.okDisabled = true;
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  ok() {
    this.modal.dismiss(this.xwsData);
  }

}

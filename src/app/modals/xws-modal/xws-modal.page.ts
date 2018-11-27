import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-xws-modal',
  templateUrl: './xws-modal.page.html',
  styleUrls: ['./xws-modal.page.scss'],
})
export class XwsModalPage implements OnInit {

  xwsData: any = null;
  dataValid: boolean = false;

  constructor(public modal: ModalController) { }

  ngOnInit() {
  }

  processXws(value: string) : boolean {
    try {
      this.xwsData = { xws: JSON.parse(value) };
      return true;
    } catch(error) {
      return false;
    } 
  }

  processFFGSquadBuilder(value: string) : boolean {
    if (!value || value.length == 0) {
      return false;
    }
    let isSquadBuilder = value.startsWith("https://squadbuilder.fantasyflightgames.com");
    let matchArray = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    let uuid = null;
    if (matchArray.length) {
      uuid = matchArray[0];
    }
    if (isSquadBuilder && uuid) {
      this.xwsData = { ffg: uuid };
    }
    return isSquadBuilder;
  }

  textChange($event) {
    let value = $event.detail.value;
    this.dataValid = this.processXws(value) || this.processFFGSquadBuilder(value);
  }

  cancel() {
    this.modal.dismiss();
  }

  ok() {
    this.modal.dismiss(this.xwsData);
  }

}

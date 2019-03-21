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
    let isSquadBuilder = value.includes("https://squadbuilder.fantasyflightgames.com");
    let matchArray = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    let uuid = null;
    if (matchArray && matchArray.length) {
      uuid = matchArray[0];
    }
    if (isSquadBuilder && uuid) {
      this.xwsData = { ffg: uuid };
    }
    return isSquadBuilder;
  }

  processYasb(value: string) : boolean {

    let pilotRegex = /(\d+:(\-?\d*\,?)*)+(\:U\.\-?\d+)?/g;
    if (!value || value.length == 0) {
      return false;
    }
    let isYasb = value.startsWith("https://raithos.github.io");
    if (!isYasb) {
      return false;
    }
    let matchArray = value.match(/s\=.*\&sn/g);
    this.xwsData = { 
      yasb : {
        pilots: [ ],
        name: ""
      }
    }
    if (matchArray && matchArray.length > 0) {
      let squadString = matchArray[0].substring(2).slice(0, -3);
      let pilotStrings = squadString.match(pilotRegex);
      if (pilotStrings.length > 0) {
        pilotStrings.forEach(
          (pilotString) => {
            let separatorIndex = pilotString.indexOf(':');
            let pilotId = pilotString.substring(0, separatorIndex);
            let upgradeString = pilotString.substring(separatorIndex + 1);
            let upgradeIds = upgradeString.split(',');
            this.xwsData.yasb.pilots.push({ id: pilotId, upgrades: upgradeIds });
          }
        )
        let squadNameParam = value.match(/sn\=([a-zA-Z\%\d])*/);
        if (squadNameParam.length > 0) {
          this.xwsData.yasb.name = decodeURIComponent(squadNameParam[0].split('=')[1]);
        }
        let factionNameParam = value.match(/f\=([a-zA-Z\%\d])*/);
        if (factionNameParam.length > 0) {
          this.xwsData.yasb.faction = decodeURIComponent(factionNameParam[0].split('=')[1]).replace(/\s/g, '').toLowerCase();
        }
        return true;
      }
    } else {
      return false;
    }
    return false;
  }

  textChange($event) {
    let value = $event.detail.value;
    this.dataValid = this.processXws(value) || this.processFFGSquadBuilder(value) || this.processYasb(value);
  }

  cancel() {
    this.modal.dismiss();
  }

  ok() {
    this.modal.dismiss(this.xwsData);
  }

}

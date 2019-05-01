import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { XwingDataService } from '../../services/xwing-data.service';
@Component({
  selector: 'app-xws-modal',
  templateUrl: './xws-modal.page.html',
  styleUrls: ['./xws-modal.page.scss'],
})
export class XwsModalPage implements OnInit {

  text: string;
  xwsData: any = null;
  dataValid: boolean = false;

  constructor(public modal: ModalController,
              public platform: Platform,
              public dataService: XwingDataService) { }

  ngOnInit() {
    if (this.text && this.text.length > 0) {
      this.dataValid = this.validate(this.text);
    }
  }

  oktext() {
    let message = "Paste your squadron data or URL here";
    if (!this.xwsData) {
      return message;
    }
    if ("ffg" in this.xwsData) {
      message = "FFG Squadbuilder squadron detected"
    }
    if ("launchbay" in this.xwsData) {
      message = "Launch Bay Next squadron detected";
    }
    if ("yasb" in this.xwsData) {
      message = "YASB 2.0 squadron detected";
    }
    if ("xwingtabled" in this.xwsData) {
      message = "X-Wing Tabled squadron detected";
    }
    if ("xws" in this.xwsData) {
      message = "XWS squadron detected";
    }
    return message;
  }

  processLaunchBay(value: string) : boolean {
    let matchArray = value.match(/\(\'[\d\w%]*\'.\d*.\d.\d(.\(\d*.\d*(.\(\d*.\d*\))*\))*\)/);
    if (matchArray && matchArray.length) {
      let tokens = value.slice(1, -1).split('.');
      let name = decodeURIComponent(tokens[0].slice(1, -1));
      let points = tokens[1];
      let factionId = parseInt(tokens[2]);
      let factionName = this.dataService.data.factions[0].find(faction => faction.ffg == factionId).name
      let faction = {
        faction: factionId,
        name: factionName
      }
      let remainder = tokens.slice(4).join('.');
      let deck = [ ];
      let pilotMatches = remainder.match(/.?\(\d+.\d+(.\(\d+.\d+\))*\)/g);
      pilotMatches.forEach(
        (pilotString) => {
          if (pilotString[0] == '.') {
            pilotString = pilotString.slice(1);
          }
          let pilotTokens = pilotString.slice(1, -1).split('.');
          let ship_type = parseInt(pilotTokens[0]);
          let pilotId = parseInt(pilotTokens[1]);
          let upgradeString = pilotTokens.slice(2).join('.');
          let slots = [ ];
          let upgrades = upgradeString.match(/\.?(\(\d+.\d+\))/g);
          if (upgrades) {
            upgrades.forEach(
              (upgradeString) => {
                if(upgradeString[0] == '.') {
                  upgradeString = upgradeString.slice(1);
                }
                let upgradeTokens = upgradeString.slice(1, -1).split('.');
                let upgradeId = parseInt(upgradeTokens[1]);
                slots.push(
                  {
                    id: upgradeId
                  }
                )
              }
            )
          }
          let pilot = {
            pilot_card: {
              id: pilotId
            },
            slots: slots
          }
          deck.push(pilot);
        }
      )
      let squadron = {
        name: name,
        cost: points,
        faction: faction,
        deck: deck
      }
      this.xwsData = { 
        launchbay: squadron
      }
      return true;
    }
    return false;
  }

  processURLUUID(value: string, url: string, xwsDataField: string) : boolean {
    if (!value || value.length == 0) {
      return false;
    }
    let isURL = value.includes(url);
    if (!isURL) {
      return false;
    }
    let matchArray = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/); 
    let uuid = null;
    if (matchArray && matchArray.length) {
      uuid = matchArray[0];
    } else {
      return false;
    }
    if (isURL && uuid) {
      this.xwsData = { };
      this.xwsData[xwsDataField] = uuid;
      return true;
    } else {
      return false;
    }
    return false;
  }

  processXwingTabled(value: string) : boolean {
    return this.processURLUUID(value, "https://xwingtabled.github.io/squadron/", "xwingtabled");
  }

  processFFGSquadBuilder(value: string) : boolean {
    return this.processURLUUID(value, "https://squadbuilder.fantasyflightgames.com", "ffg");
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

  processXws(value: string) : boolean {
    try {
      this.xwsData = { xws: JSON.parse(value) };
      return true;
    } catch(error) {
      return false;
    } 
  }

  validate(value: string) : boolean {
    return this.processXwingTabled(value) 
    || this.processXws(value) 
    || this.processFFGSquadBuilder(value) 
    || this.processYasb(value) 
    || this.processLaunchBay(value);
  }

  textChange($event) {
    let value = $event.detail.value;
    this.dataValid = this.validate(value);
  }

  cancel() {
    this.modal.dismiss();
  }

  ok() {
    this.modal.dismiss(this.xwsData);
  }
}

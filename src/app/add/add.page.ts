import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { XwingDataService } from '../services/xwing-data.service';
import { XwingImportService } from '../services/xwing-import.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-page',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  text: string;
  xwsData: any = null;
  dataValid: boolean = false;

  constructor(public modal: ModalController,
              public platform: Platform,
              public dataService: XwingDataService,
              private importService: XwingImportService,
              private location: Location,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.text = this.importService.qrData;
    this.importService.qrData = "";
    if (this.text) {
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
    value = value.trim();
    let upgradeRegex = /(\.\d+)/g;
    let slotRegex = /(\.\(\d+(\.\d+)+\))/g;
    let pilotRegex = /(\.\(\d+\.\d+(\.\(\d+(\.\d+)+\))+\))/g;
    let squadronNameRegex = /(\'[\w\d\%]*\')/g;
    let headerRegex = /(\.\d+\.\d+\.\d+)/g;
    let launchBayRegex = /\((\'[\w\d\%]*\')(\.\d+\.\d+\.\d+)(\.\(\d+\.\d+(\.\(\d+(\.\d+)+\))+\))+\)/g;
    let deck = [ ];
    let matchArray = value.match(launchBayRegex);
    if (matchArray && matchArray.length) {
      let squadronNameRegexMatches = value.match(squadronNameRegex);
      let pilotRegexMatches = value.match(pilotRegex);
      let headerRegexMatches = value.match(headerRegex);
      let name = decodeURIComponent(squadronNameRegexMatches[0].slice(1, -1));
      let points = parseInt(headerRegexMatches[0].split('.')[1]);
      let factionId = parseInt(headerRegexMatches[0].split('.')[2]);
      let factionName = this.dataService.data.factions[0].find(faction => faction.ffg == factionId).name
      let faction = {
        faction: factionId,
        name: factionName
      }
      pilotRegexMatches.forEach(
        (pilotMatch) => {
          let pilotString = pilotMatch.slice(2);
          let pilotTokens = pilotString.split('.');
          let pilotId = parseInt(pilotTokens[1]);
          let slots = [ ];
          let slotMatches = pilotMatch.match(slotRegex);
          if (slotMatches) {
            slotMatches.forEach(
              (slotMatch) => {
                let upgradeMatches = slotMatch.match(upgradeRegex);
                if (upgradeMatches) {
                  upgradeMatches.forEach(
                    (upgradeString) => {
                      if (upgradeString[0] == '.') {
                        upgradeString = upgradeString.slice(1);
                      }
                      slots.push(
                        {
                          id: parseInt(upgradeString)
                        }
                      )
                    }
                  )
                }
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
    this.location.back();
  }

  ok() {
    this.location.back();
  }
}

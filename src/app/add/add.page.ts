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
  launchBayData: any = null;
  ffgData: any = null;
  yasbData: any = null;
  xwingTabledData: any = null;
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
    this.validate(this.text);
  }

  validateLaunchBay(value: string) : boolean {
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
      this.launchBayData = squadron;
      return true;
    }
    return false;
  }

  validateURLUUID(value: string, url: string) : string {
    if (!value || value.length == 0) {
      return null;
    }
    let isURL = value.includes(url);
    if (!isURL) {
      return null;
    }
    let matchArray = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/); 
    let uuid = null;
    if (matchArray && matchArray.length) {
      uuid = matchArray[0];
    } else {
      return null;
    }
    if (isURL && uuid) {
      return uuid;
    }
    return null;
  }

  async validateXwingTabled(value: string) {
    let uuid = this.validateURLUUID(value, "https://xwingtabled.github.io/squadron/");
    if (!uuid) {
      return false;
    }
    try {
      this.xwingTabledData = await this.importService.processXwingTabled(uuid);
      console.log("Retrieved xwingtabled squadron", this.xwingTabledData);
      return true;
    } catch (error) {
      return false;
    }
  }

  async validateFFGSquadBuilder(value: string) {
    let uuid = this.validateURLUUID(value, "https://squadbuilder.fantasyflightgames.com");
    if (!uuid) {
      return false;
    }
    try {
      this.ffgData = await this.importService.processFFG(uuid);
      return true;
    } catch (error) {
      return false;
    }
  }

  validateYasb(value: string) {
    let pilotRegex = /(\d+:(\-?\d*\,?)*)+(\:U\.\-?\d+)?/g;
    if (!value || value.length == 0) {
      return false;
    }
    let isYasb = value.startsWith("https://raithos.github.io");
    if (!isYasb) {
      return false;
    }
    let matchArray = value.match(/s\=.*\&sn/g);
    this.yasbData = {
      pilots: [ ],
      name: ""
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
            this.yasbData.pilots.push({ id: pilotId, upgrades: upgradeIds });
          }
        )
        let squadNameParam = value.match(/sn\=([a-zA-Z\%\d])*/);
        if (squadNameParam.length > 0) {
          this.yasbData.name = decodeURIComponent(squadNameParam[0].split('=')[1]);
        }
        let factionNameParam = value.match(/f\=([a-zA-Z\%\d])*/);
        if (factionNameParam.length > 0) {
          this.yasbData.faction = decodeURIComponent(factionNameParam[0].split('=')[1]).replace(/\s/g, '').toLowerCase();
        }
        return true;
      }
    } else {
      return false;
    }
    return false;
  }

  validateXws(value: string) : boolean {
    try {
      this.xwsData = JSON.parse(value);
      return true;
    } catch(error) {
      return false;
    } 
  }

  async validate(value: string)  {
    this.launchBayData = null;
    this.ffgData = null;
    this.yasbData = null;
    this.xwingTabledData = null;
    this.xwsData = null;
    await this.validateXwingTabled(value) 
    this.validateXws(value) 
    await this.validateFFGSquadBuilder(value) 
    this.validateYasb(value) 
    this.validateLaunchBay(value);
  }

  textChange($event) {
    let value = $event.detail.value;
    this.validate(value);
  }

  openQr() {
    this.router.navigateByUrl("/qr");
  }

  cancel() {
    this.location.back();
  }

  ok() {
    this.location.back();
  }
}

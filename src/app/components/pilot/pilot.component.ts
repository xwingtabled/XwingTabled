import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { PilotModalPage } from '../../modals/pilot-modal/pilot-modal.page';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular'
import { Events } from '@ionic/angular';
@Component({
  selector: 'xws-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  @Input() squadron: any;
  @Input() pilot: any;
  @Input() faction: string;
  columns: any[][] = [];
  img_url: string = null;
  shipData: any;
  pilotData: any;

  constructor(public dataService: XwingDataService, 
              public modalController: ModalController, 
              public platform: Platform,
              public events: Events) { }

  getStatString(statname: string) : string {
    this.pilot.ship.stats.forEach(
      (stat) => {
        if (stat['type'] == statname) {
          if (stat.value != stat.remaining) {
            return "(" + stat.remaining + ")";
          } else {
            return stat.value;
          }
        }
      }
    );
    return "";
  }

  ngOnInit() {
    let column: any[] = [];
    this.pilot.upgrades.forEach(
      (upgrade) => {
        column.push(upgrade);
        if (column.length == 2) {
          this.columns.push(column);
          column = [];
        }
      }
    )
    if (column.length > 0) {
      this.columns.push(column);
    }
    let get_url = this.pilot.pilot.artwork;
    if (!get_url) {
      get_url = this.pilot.pilot.image;
    }
    if (get_url) {
      this.dataService.get_image_by_url(get_url).then(
        (url) => {
          this.img_url = url;
        }
      )
    }
  }

  async presentPilotModal() {
    let stateString = JSON.stringify(this.pilot);
    const modal = await this.modalController.create({
      component: PilotModalPage,
      componentProps: {
        pilot: this.pilot,
        squadron: this.squadron
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (stateString != JSON.stringify(this.pilot)) {
      this.events.publish("snapshot", "create snapshot");
    }
  }

  showPilot() {
    this.presentPilotModal();
  }

}

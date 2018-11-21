import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { PilotModalPage } from '../../pilot-modal/pilot-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'xws-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  @Input() squadron: any;
  @Input() pilot: any;
  @Input() faction: string;
  img_url: string = "";
  shipData: any;
  pilotData: any;

  constructor(public dataService: XwingDataService, private modalController: ModalController) { }

  

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

    console.log(this.pilot);
  }

  async presentPilotModal() {
    const modal = await this.modalController.create({
      component: PilotModalPage,
      componentProps: {
        pilot: this.pilot,
        squadron: this.squadron
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  showPilot() {
    this.presentPilotModal();
  }

}

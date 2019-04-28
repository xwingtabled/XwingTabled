import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { XwingStateService } from '../../services/xwing-state.service';
import { FirebaseService } from '../../services/firebase.service';
import { XwingImportService } from '../../services/xwing-import.service';
import { ModalController } from '@ionic/angular';
import { LayoutService } from '../../services/layout.service';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-pilot-modal',
  templateUrl: './settings-modal.page.html',
  styleUrls: ['./settings-modal.page.scss'],
})
export class SettingsModalPage implements OnInit {


  constructor(public toastController: ToastController, 
              private dataService: XwingDataService,
              public state: XwingStateService,
              private alertController: AlertController,
              private ngZone: NgZone,
              public modalController: ModalController,
              public layout: LayoutService,
              public firebase: FirebaseService,
              public router: Router,
              public importService: XwingImportService) { }

  ngOnInit() {

  }

  async resetData() {
    const alert = await this.alertController.create({
      header: 'Clear data cache?',
      message: 'You are about to reset your data cache. You may have to re-download some data.',
      buttons: [
        { text: 'OK',
          handler: () => {
            this.ngZone.run(
              () => {
                this.state.reset();
                this.dataService.reset();
                this.modalController.dismiss();
              }
            )
          }
        },
        { text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary' }
      ]
    });
    await alert.present();
  }

  goToSquadron(uuid: string) {
    this.modalController.dismiss();
    this.router.navigateByUrl("/squadron/" + uuid.substring(0, 8));
  }

  closeSquadron(uuid: string) {
    this.state.closeSquadron(uuid);
  }

  async import() {
    await this.modalController.dismiss();
    await this.importService.presentXwsModal();
  }

  logout() {
    this.firebase.logout();
  }

  login() {
    this.firebase.login();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

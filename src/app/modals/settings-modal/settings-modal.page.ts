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
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
@Component({
  selector: 'app-pilot-modal',
  templateUrl: './settings-modal.page.html',
  styleUrls: ['./settings-modal.page.scss'],
})
export class SettingsModalPage implements OnInit {

  cloudSquadrons: any[] = [];
  currentSquadronUUID: string = null;

  constructor(public toastController: ToastController, 
              private dataService: XwingDataService,
              public state: XwingStateService,
              private alertController: AlertController,
              private ngZone: NgZone,
              public modalController: ModalController,
              public layout: LayoutService,
              public firebase: FirebaseService,
              public router: Router,
              public route: ActivatedRoute,
              public importService: XwingImportService) { }

  ngOnInit() {
    if (this.firebase.loggedIn()) {
      this.getSquadrons();
    }
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
    this.router.navigateByUrl("/squadron/" + uuid);
  }

  isLocalSquadron(uuid: string) {
    return this.state.getSquadronIndex(uuid) > -1;
  }

  importSquadron(squadron) {
    this.state.importSquadron(squadron);
  }

  async deleteSquadron(squadron: any) {
    const alert = await this.alertController.create({
      header: 'Delete ' + squadron.name + '?',
      message: 'This will permanently remove the squadron from both the cloud and this device',
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              async () => {
                await this.firebase.deleteSquadron(squadron.uuid);
                let destination = this.state.closeSquadron(squadron.uuid);
                this.getSquadrons();
                if (this.currentSquadronUUID == squadron.uuid) {
                  if (!destination) {
                    this.router.navigateByUrl("/");
                  } else {
                    this.router.navigateByUrl("/squadron/" + destination);
                  }
                }
              }
            )
          }
        },
        { text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary' }
      ]
    });
    return await alert.present();
  }

  getSquadronClass(squadron: any) {
    if (!this.isLocalSquadron(squadron.uuid)) {
      return "offline";
    }
    return squadron.faction;
  }

  async getSquadrons() {
    this.cloudSquadrons = [ ];
    let result = await this.firebase.mysquadrons();
    result.docs.forEach(
      (doc) => {
        this.cloudSquadrons.push(doc.data())
      }
    )
  }

  async logout() {
    await this.firebase.logout();
    this.cloudSquadrons = [ ];
  }

  async login() {
    await this.firebase.login();
    await this.getSquadrons();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

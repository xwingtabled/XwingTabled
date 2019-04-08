import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { XwsModalPage } from '../modals/xws-modal/xws-modal.page';
import { Router } from '@angular/router';
import { XwingDataService } from '../services/xwing-data.service';
import { Platform } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DamageDeckActionsComponent } from '../popovers/damage-deck-actions/damage-deck-actions.component';
import { NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { XwingStateService } from '../services/xwing-state.service';
import { XwingImportService } from '../services/xwing-import.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  data_progress: number = 0;
  data_message: string = "X-Wing Tabled";
  retry_button: boolean = false;
  retry_button_disabled: boolean = false;
  data_button: boolean = false;
  data_button_disabled: boolean = false;
  image_button: boolean = false;
  image_button_disabled: boolean = false;

  constructor(public modalController: ModalController, 
              public dataService: XwingDataService,
              public router: Router,
              public platform: Platform,
              public popoverController: PopoverController,
              private events: Events,
              private alertController: AlertController,
              private ngZone: NgZone,
              private toastController: ToastController,
              private storage: Storage,
              private http: HttpProvider,
              private loadingCtrl: LoadingController,
              public state: XwingStateService,
              private importService: XwingImportService) { }

  ngOnInit() {
    this.events.subscribe(
      this.dataService.topic,
      async (event) => {
        await this.data_event_handler(event);
      }
    );
  }

  ionViewDidEnter() {
    console.log("Snapshot check");
    this.state.snapshotCheck();
  }

  getPoints() {
    if (!this.state.squadron.pilots) {
      return "";
    }
    let pointsDestroyed = 0;
    let totalPoints = 0;
    this.state.squadron.pilots.forEach(
      (pilot) => {
        pointsDestroyed += this.dataService.getPointsDestroyed(pilot);
        totalPoints += this.dataService.getPilotPoints(pilot);
      }
    )
    return "( " + pointsDestroyed + " / " + totalPoints + " )";
  }

  async data_event_handler(event: any) {
    this.data_message = event.message;
    this.data_progress = event.progress;
    if (event.status == "manifest_incomplete") {
      this.data_button = true;
      this.data_message = "X-Wing Tabled requires a local data update";
    }
    if (event.status == "data_download_errors") {
      this.data_button = true;
      this.data_message = "Some X-Wing data could not be downloaded";
    }
    if (event.status == "no_data_no_connection") {
      this.retry_button = true;
      this.retry_button_disabled = false;
      const alert = await this.alertController.create({
        header: 'Internet Connection Required',
        message: 'An Internet connection is required to update or download necessary data files the first time X-Wing Tabled runs.',
        buttons: [
          { text: 'Retry',
            handler: () => { 
              this.ngZone.run(
                async () => {
                  await this.alertController.dismiss();
                  this.retryDownload();
                }
              )
            }
          },
        ]
      });
      return await alert.present();
    }
    if (event.status == "loading_images") {
      // Disable screen interactions with LoadingController
      const loading = await this.loadingCtrl.create({
        message: "Loading artwork"
      });
      await loading.present();
      // Once the loading screen is present, signal XwingDataService that
      // the controller is present. It will begin image loading sequence.
      this.events.publish("mainpage", { message : "loading_controller_present" });
    }
    if (event.status == "loading_images_complete") {
      try {
        await this.loadingCtrl.dismiss();
      } catch (err) {

      }
    }
    if (event.status == "manifest_current" || event.status == "data_download_complete") {
      this.data_button = false;
    }
    if (event.status == "images_missing") {
      this.data_message = "X-Wing Tabled needs to download some artwork";
      this.image_button = true;
    }
    if (event.status == "images_complete") {
      this.image_button = false;
      await this.loadState();
    }
    if (event.status == "image_download_incomplete") {
      this.image_button = true;
    }
    if (event.status == "image_download_complete") {
      await this.loadState();
    }
  }

  async loadState() {
    console.log("Restoring...");
    await this.state.restoreFromDisk();
    console.log("Restored!");
    if (this.state.snapshots && this.state.snapshots.length) {
      this.toastUndo(this.state.getLastSnapshotTime());
    }
    if (!this.state.squadron) {
      this.presentXwsModal();
    }
  }

  retryDownload() {
    this.retry_button_disabled = true;
    this.retry_button = false;
    this.dataService.check_manifest();
  }

  downloadData() {
    this.data_button_disabled = true;
    this.dataService.check_manifest();
  }

  downloadArtwork() {
    this.image_button_disabled = true;
    this.dataService.download_missing_images(this.dataService.data);
  }

  async presentDamageDeckActionsPopover(ev: any, squadron: any) {
    const popover = await this.popoverController.create({
      component: DamageDeckActionsComponent,
      componentProps: {
        squadron: squadron
      },
      event: ev
    });
    return await popover.present();
  }

  async resetData(squadron: any) {
    const alert = await this.alertController.create({
      header: 'Clear data cache?',
      message: 'You are about to reset your data cache. You may have to re-download some data.',
      buttons: [
        { text: 'OK',
          handler: () => {
            this.ngZone.run(
              () => {
                this.data_progress = 0;
                this.data_message = "X-Wing Tabled";
                this.data_button = false;
                this.data_button_disabled = false;
                this.image_button = false;
                this.image_button_disabled = false;
                this.dataService.reset();
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

  async askRechargeRecurring() {
    const alert = await this.alertController.create({
      header: 'Recharge Recurring',
      message: 'Do you wish to recover all recurring ' +
               '<i class="xwing-miniatures-font xwing-miniatures-font-charge"></i> and ' +
               '<i class="xwing-miniatures-font xwing-miniatures-font-forcecharge"></i>?',
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              () => {
                this.state.rechargeAllRecurring();
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

  async toastUndo(timestamp: string) {
    const toast = await this.toastController.create({
      message: 'Table restored to ' + timestamp,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async askUndo() {
    const alert = await this.alertController.create({
      header: 'Rewind Time?',
      message: 'This will rewind time to ' + this.state.snapshots[this.state.snapshots.length - 2].time,
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              () => {
                let time = this.state.undo();
                this.toastUndo(time);
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

 
  async askReset() {
    const alert = await this.alertController.create({
      header: 'Reset all squadrons?',
      message: 'All charges, force and shields will be restored, damage cards shuffled and conditions removed.',
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              async () => {
                this.state.resetSquadron();
                const toast = await this.toastController.create({
                  message: 'Squadrons reset',
                  duration: 2000,
                  position: 'bottom'
                });
                toast.present();
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

  async toastNotFound(xws: string, xwsType: string) {
    const toast = await this.toastController.create({
      message: "WARNING: The " + xwsType + " " + xws + " could not be found. Try nuking your local data and downloading the latest XWS Data.",
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  xwsAddButton() {
    this.presentXwsModal();
  }

  async presentXwsModal() {
    const modal = await this.modalController.create({
      component: XwsModalPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) return;
    try {
      if (data.ffg) {
        let url = "https://squadbuilder.fantasyflightgames.com/api/squads/" + data.ffg + "/";
    
        this.http.get(url).subscribe(
          (data) => {
            this.state.setSquadron(this.importService.processFFG(data))
          },
          async (error) => {
            console.log("Unable to get FFG SquadBuilder data", error);
            const toast = await this.toastController.create({
              message: "ERROR: Unable to load FFG Squad",
              duration: 5000,
              position: 'bottom'
            });
            toast.present();
          }
        );

        this.state.setSquadron(this.importService.processFFG(data.ffg));
      }
      if (data.yasb) {
        this.state.setSquadron(this.importService.processYasb(data.yasb));
      }
      if (data.xws) {
        let squadron = data.xws;
        this.state.setSquadron(this.importService.processXws(squadron));
      }
    } catch (e) {
      console.log(e);
      const toast = await this.toastController.create({
        message: e,
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }
}

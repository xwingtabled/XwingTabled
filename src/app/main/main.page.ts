import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { XwsModalPage } from '../modals/xws-modal/xws-modal.page';
import { SettingsModalPage } from '../modals/settings-modal/settings-modal.page';
import { XwingDataService } from '../services/xwing-data.service';
import { Platform } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DamageDeckActionsComponent } from '../popovers/damage-deck-actions/damage-deck-actions.component';
import { NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpProvider } from '../providers/http.provider';
import { XwingStateService } from '../services/xwing-state.service';
import { XwingImportService } from '../services/xwing-import.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { FirebaseService } from '../services/firebase.service';

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
  continue_button: boolean = false;

  squadronUUID: string;
  squadron: any = null;

  constructor(public modalController: ModalController, 
              public dataService: XwingDataService,
              public router: Router,
              public platform: Platform,
              public popoverController: PopoverController,
              private events: Events,
              private alertController: AlertController,
              private ngZone: NgZone,
              private toastController: ToastController,
              private http: HttpProvider,
              private loadingCtrl: LoadingController,
              public state: XwingStateService,
              private importService: XwingImportService,
              private route: ActivatedRoute,
              public layout: LayoutService,
              public firebase: FirebaseService) { }

  ngOnInit() {
    this.squadronUUID = this.route.snapshot.paramMap.get("squadronUUID");
  }

  ionViewWillEnter() {
    this.squadron = this.state.getSquadron(this.squadronUUID);
    this.events.subscribe(
      this.dataService.topic,
      async (event) => {
        await this.data_event_handler(event);
      }
    );

    this.events.subscribe(
      this.state.topic,
      (uuids) => {
        if (this.squadronUUID && uuids.includes(this.squadronUUID)) {
          this.squadron = this.state.getSquadron(this.squadronUUID);
        } 
      }
    )
  }

  ionViewWillLeave() {
    this.events.unsubscribe(this.dataService.topic);
    this.events.unsubscribe(this.state.topic);
  }

  getPointsDestroyed(squadron) {
    let points = 0;
    squadron.pilots.forEach(
      (pilot) => {
        points += this.dataService.getPointsDestroyed(pilot);
      }
    )
    return points;
  }

  getPointTotal(squadron) {
    let points = 0;
    squadron.pilots.forEach(
      (pilot) => {
        points += this.dataService.getPilotPoints(pilot);
      }
    )
  }

  nextSquadron() {
    if (!this.squadron) {
      return null;
    }
    let index = this.state.getSquadronIndex(this.squadron.uuid) + 1;
    if (index >= this.state.squadrons.length) {
      return null;
    }
    return this.state.squadrons[index];
  }

  previousSquadron() {
    if (!this.squadron) {
      return null;
    }
    let index = this.state.getSquadronIndex(this.squadron.uuid) - 1;
    if (index < 0) {
      return null;
    }
    return this.state.squadrons[index];
  }

  squadronRoute(uuid: string) {
    return "/squadron/" + uuid;
  }

  goToSquadron(squadron: any) {
    if (!squadron) {
      return;
    }
    let uuid = squadron.uuid;
    if (uuid == this.squadronUUID) {
      return;
    }
    this.router.navigateByUrl(this.squadronRoute(uuid));
    return;
  }

  closeSquadron() {
    let index = this.state.getSquadronIndex(this.squadronUUID);
    this.state.closeSquadron(this.squadronUUID);
    if (this.state.squadrons.length == 0) {
      this.router.navigateByUrl("/");
      return;
    }
    if (index >= this.state.squadrons.length) {
      index = this.state.squadrons.length - 1;
    }
    let newUUID = this.state.squadrons[index].uuid;
    this.router.navigateByUrl(this.squadronRoute(newUUID));
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
      this.image_button = false;
      this.image_button_disabled = false;
      this.continue_button = true;
    }
    if (event.status == "image_download_complete") {
      await this.loadState();
    }
  }

  continueAnyway() {
    this.dataService.initialized = true;
  }

  async loginAndRetry() {
    try {
      await this.firebase.login();
      await this.loadOnlineSquadron();
    } catch {
      console.log("Unable to load squadron with UUID after logging in", this.squadronUUID);
    }
  }

  async loadOnlineSquadron() {
    const loading = await this.loadingCtrl.create({
      message: "Looking for squadron online"
    });
    await loading.present();
    try {
      let result = await this.firebase.retrieveSquadron(this.squadronUUID);
      if (result.exists) {
        this.squadron = result.data();
        this.state.importSquadron(this.squadron);
        this.firebase.subscribeSquadron(this.squadronUUID);
      }
    } catch {
      console.log("Unable to load squadron from firebase with UUID", this.squadronUUID);
    }
    return await this.loadingCtrl.dismiss();
  }

  async loadState() {
    console.log("Restoring squadrons from local storage");
    await this.state.restoreFromDisk();
    if (this.state.snapshots && this.state.snapshots.length) {
      this.toastUndo(this.state.getLastSnapshotTime());
    }
    console.log("Syncing squadrons with Firebase");
    await this.firebase.synchronize();
    this.squadron = this.state.getSquadron(this.squadronUUID);
    try {
      if (!this.squadron) {
        await this.loadOnlineSquadron();
      }
    } catch (err) {
      console.log("Error while checking for online squadron", err);
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
    this.dataService.download_missing_images();
  }

  async damageDeck() {
    const popover = await this.popoverController.create({
      component: DamageDeckActionsComponent,
      componentProps: {
        squadronUUID: this.squadronUUID
      },
    });
    return await popover.present();
  }



  async askRecharge() {
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
                this.state.rechargeAllRecurring(this.squadronUUID);
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

  async askClose() {
    const alert = await this.alertController.create({
      header: 'Close squadron?',
      message: 'This will close the current squadron',
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              () => {
                this.closeSquadron();
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
      header: 'Reset squadrons?',
      message: 'All charges, force and shields will be restored, damage cards shuffled and conditions removed.',
      buttons: [
        { text: 'OK',
          handler: () => { 
            this.ngZone.run(
              async () => {
                this.state.resetSquadron(this.squadronUUID);
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
    //this.presentXwsModal();
    this.importService.presentXwsModal();
  }

  async presentSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsModalPage
    });
    return await modal.present();
  }
}

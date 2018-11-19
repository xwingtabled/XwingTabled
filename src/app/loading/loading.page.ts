import { Component, OnInit } from '@angular/core';
import { XwingDataService } from '../services/xwing-data.service';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'loading.page.html',
  styleUrls: ['loading.page.scss'],
})
export class LoadingPage {
  events: Events;

  data_button: boolean = false;
  data_button_disabled: boolean = false;
  data_interface: boolean = true;
  data_message: string = "";
  data_progress: number = 0;

  images_interface: boolean = false;
  images_button: boolean = false;
  images_button_disabled: boolean = false;
  images_progress: number = 0;
  images_message: string = "";

  continue_button: boolean = false;

  img_src: string = "";
  router: Router;

  constructor(private dataService: XwingDataService, 
              events: Events, 
              public modalController: ModalController) {
    this.events = events;
  }

  ngOnInit() {
    this.events.subscribe(this.dataService.topic, (event) => {
      this.data_event_handler(event);
    });
  }

  data_event_handler(event: any) {
    this.data_message = event.message;
    this.data_progress = event.progress;
    if (event.status == "manifest_outofdate") {
      this.data_button = true;
      this.data_button_disabled = false;
    }
    if (event.status == "manifest_current" || event.status == "data_download_complete") {
      console.log("proceeding to load_images");
      this.data_interface = false;
      this.images_interface = true;
    }
    if (event.status == "images_missing") {
      this.images_button = true;
      this.images_button_disabled = false;
    }
    if (event.status == "images_complete") {
      this.images_button = false;
      this.continue();
    }
    if (event.status == "image_download_incomplete") {
      this.images_button = true;
      this.images_button_disabled = false;
    }
    if (event.status == "image_download_complete") {
      this.continue();
    }
  }
  
  continue() {
    console.log("all data loaded, dismissing modal");
    this.modalController.dismiss();
  }

  download_data() {
    this.data_button_disabled = true;
    this.dataService.download_data();
  }

  download_images() {
    this.images_button_disabled = true;
    this.dataService.download_missing_images(this.dataService.data);
  }
}

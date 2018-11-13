import { Component, OnInit } from '@angular/core';
import { XwingJsonDataService } from '../services/xwing-json-data.service';
import { XwingImageService } from '../services/xwing-image.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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

  dataService: XwingJsonDataService;
  imageService: XwingImageService;
  img_src: string = "";

  constructor(dataService: XwingJsonDataService, imageService: XwingImageService, events: Events) {
    this.dataService = dataService;
    this.imageService = imageService;
    this.events = events;
  }

  ngOnInit() {
    this.events.subscribe(this.dataService.topic, (event) => {
      this.data_event_handler(event);
    });
    this.events.subscribe(this.imageService.topic, (event) => {
      this.image_event_handler(event);
    });
  }

  data_event_handler(event: any) {
    this.data_message = event.message;
    this.data_progress = event.progress;
    if (event.status == "data_missing") {
      this.data_button = true;
      this.data_button_disabled = false;
    }
    if (event.status == "data_complete" || event.status == "data_download_complete") {
      this.data_interface = false;
      this.images_interface = true;
      console.log("manifest data downloaded, triggering image load");
      this.imageService.load_images(this.dataService.data);
    }
  }

  image_event_handler(event: any) {
    this.images_message = event.message;
    this.images_progress = event.progress;
    if (event.status == "images_missing") {
      this.images_button = true;
      this.images_button_disabled = false;
    }
    if (event.status == "images_complete") {
      this.images_button = false;
      this.img_src = this.imageService.image_urls["card_pilot_1"];
    }
  }

  download_data() {
    this.data_button_disabled = true;
    this.dataService.download_data();
  }

  download_images() {
    this.images_button_disabled = true;
    this.imageService.download_missing_images(this.dataService.data);
  }
}

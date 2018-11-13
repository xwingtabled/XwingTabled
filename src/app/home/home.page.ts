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
  download_data: boolean = false;
  download_images: boolean = false;
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
    if (event.status == "data_missing") {
      this.download_data = true;
    }
    if (event.status == "data_complete") {
      this.download_data = false;
      console.log("manifest data downloaded, triggering image load");
      this.imageService.load_images(this.dataService.data);
    }
  }

  image_event_handler(event: any) {
    if (event.status == "images_missing") {
      this.download_images = true;
    }
    if (event.status == "images_complete") {
      this.download_images = false;
      this.img_src = this.imageService.image_urls["card_pilot_1"];
    }
  }
}

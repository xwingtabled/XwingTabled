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
      this.imageService.load_images(this.dataService.data);
    }
  }

  image_event_handler(event: any) {
    if (event.status == "images_complete") {
      this.img_src = this.imageService.data["card_pilot_1"];
    }
  }
}

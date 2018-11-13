import { Component, OnInit } from '@angular/core';
import { XwingJsonDataService } from '../services/xwing-json-data.service';
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

  constructor(dataService: XwingJsonDataService, events: Events) {
    this.dataService = dataService;
    this.events = events;
  }

  ngOnInit() {
    this.events.subscribe(this.dataService.topic, (event) => {
      this.data_event_handler(event);
    });
  }

  data_event_handler(event: any) {
    if (event.status == "data_missing") {
      this.download_data = true;
    }
    if (event.status == "data_complete") {
      this.download_data = false;
    }
  }
}

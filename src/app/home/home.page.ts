import { Component } from '@angular/core';
import { XwingJsonDataService } from '../services/xwing-json-data.service';
import { Events } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  events: Events;
  constructor(dataService: XwingJsonDataService, events: Events) {
    this.events = events;
  }
}

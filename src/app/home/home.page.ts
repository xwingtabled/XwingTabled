import { Component } from '@angular/core';
import { XwingJsonDataService } from '../services/xwing-json-data.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(dataService: XwingJsonDataService) {

  }
}

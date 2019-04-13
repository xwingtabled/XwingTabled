import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { LayoutService } from '../../services/layout.service';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular'
import { Events } from '@ionic/angular';
import { XwingStateService } from '../../services/xwing-state.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Component({
  selector: 'squadron',
  templateUrl: './squadron.component.html',
  styleUrls: ['./squadron.component.scss']
})
export class SquadronComponent implements OnInit {
  constructor(public dataService: XwingDataService, 
      public modalController: ModalController, 
      public platform: Platform,
      public events: Events,
      public layout: LayoutService,
      public state: XwingStateService,
      private router: Router,
      private ngZone: NgZone) { }
    
  ngOnInit() {

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
}
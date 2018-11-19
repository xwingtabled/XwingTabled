import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';

@Component({
  selector: 'xws-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  @Input() pilot: any;
  @Input() faction: string;
  img_url: string = "";
  shipData: any;
  pilotData: any;

  constructor(public dataService: XwingDataService) { }

  ngOnInit() {
    this.shipData = this.dataService.getShip(this.faction, this.pilot.ship);
    this.pilotData = this.dataService.getPilot(this.faction, this.pilot.ship, this.pilot.name);
    this.dataService.get_image_by_url(this.pilotData.image).then(
      base64url => {
        this.img_url = base64url;
      }
    )
  }

  showPilot() {
    console.log(this.pilot);
    console.log(this.pilotData);
    console.log(this.shipData);
  }

}

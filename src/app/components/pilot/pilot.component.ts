import { Component, OnInit, Input } from '@angular/core';
import { XwingJsonDataService } from '../../services/xwing-json-data.service';
import { XwingImageService } from '../../services/xwing-image.service';

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

  constructor(public data: XwingJsonDataService, public images: XwingImageService) { }

  ngOnInit() {
    this.shipData = this.data.getShipData(this.faction, this.pilot.ship);
    this.pilotData = this.data.getPilotData(this.faction, this.pilot.ship, this.pilot.name);
    this.images.get_image_by_url(this.pilotData.image).then(
      base64url => {
        this.img_url = base64url;
      }
    )
  }

}

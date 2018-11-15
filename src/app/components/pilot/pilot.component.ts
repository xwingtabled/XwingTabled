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
  img_url: string = "";

  constructor(public data: XwingJsonDataService, public images: XwingImageService) { }

  ngOnInit() {

  }

}

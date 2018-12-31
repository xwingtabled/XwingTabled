import { Component, OnInit, Input } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { ModalController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { XwingStateService } from '../../services/xwing-state.service';
import { Router } from '@angular/router';
@Component({
  selector: 'xws-phone-upgrade',
  templateUrl: './phone-upgrade.component.html',
  styleUrls: ['./phone-upgrade.component.scss']
})
export class PhoneUpgradeComponent implements OnInit {
  @Input() upgrade: any = { };
  @Input() pilotNum: number;

  constructor(public dataService: XwingDataService, 
              private modalController: ModalController,
              private events: Events,
              public state: XwingStateService,
              private router: Router) { }

  ngOnInit() {
  }

  showUpgrade() {
    this.router.navigateByUrl('/pilot/' + this.pilotNum + "/upgrade/" + this.upgrade.num);
  }
}

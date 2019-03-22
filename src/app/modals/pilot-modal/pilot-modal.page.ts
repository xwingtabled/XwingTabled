import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { XwingStateService } from '../../services/xwing-state.service';
import { ConditionMenuComponent } from '../../popovers/condition-menu/condition-menu.component';
import { DamagePopoverComponent } from '../../popovers/damage-popover/damage-popover.component';
import { DamageCardSelectComponent } from '../../popovers/damage-card-select/damage-card-select.component';
import { AssignIdPopoverComponent } from '../../popovers/assign-id-popover/assign-id-popover.component';
import { ModalController } from '@ionic/angular';
import { LayoutService } from '../../services/layout.service';
import { ActivatedRoute, Router } from "@angular/router";
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pilot-modal',
  templateUrl: './pilot-modal.page.html',
  styleUrls: ['./pilot-modal.page.scss'],
})
export class PilotModalPage implements OnInit {
  pilot;
  img_url: string = null;
  card_text: string = null;

  shields: any = null;
  charges: any = null;
  force: any = null;
  faBars = faBars;
  expanded: boolean = false;
  useAngularRouter: boolean = false;
  tab: string = "tokens";

  maneuverChart: any[] = new Array(7);

  constructor(public toastController: ToastController, 
              private popoverController: PopoverController,
              private dataService: XwingDataService,
              public state: XwingStateService,
              private alertController: AlertController,
              private events: Events,
              private ngZone: NgZone,
              public modalController: ModalController,
              public layout: LayoutService,
              private route: ActivatedRoute,
              private router: Router) { }

  async assignIdNumber() {
    const popover = await this.popoverController.create({
      component: AssignIdPopoverComponent,
      componentProps: {
        id: this.pilot.idNumber,
      }
    });
    popover.onDidDismiss().then(
      (result) => {
        console.log(result);
        this.pilot.idNumber = result.data
      }
    )
    await popover.present();  
  }

  ngOnInit() {
    let pilotNum = this.route.snapshot.paramMap.get("pilotNum");
    if (pilotNum) {
      this.useAngularRouter = true;
      this.pilot = this.state.squadron.pilots.find(pilot => pilot.num == pilotNum);
    }
    // Load pilot card
    if (this.pilot.pilot.image) {
      this.dataService.get_image_by_url(this.pilot.pilot.image).then(
        (url) => {
          this.img_url = url;
        },
        (error) => {
        }
      );
    }
  }

  hasManeuvers(row: any) : boolean {
    let maneuvers = row.maneuvers;
    for (let cell of maneuvers) {
      if (cell) {
        return true;
      }
    }
    return false;
  }

  dismiss() {
    if (this.useAngularRouter) {
      this.router.navigateByUrl("/");
    } else {
      this.modalController.dismiss();
    }
  }
}

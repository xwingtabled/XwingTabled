import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PilotActionsComponent } from '../../popovers/pilot-actions/pilot-actions.component';
import { XwingDataService } from '../../services/xwing-data.service';
@Component({
  selector: 'app-pilot-modal',
  templateUrl: './pilot-modal.page.html',
  styleUrls: ['./pilot-modal.page.scss'],
})
export class PilotModalPage implements OnInit {
  pilot;
  squadron;
  img_url: string = "";

  shields: any = null;
  charges: any = null;
  force: any = null;

  constructor(public toastController: ToastController, 
              private popoverController: PopoverController,
              private dataService: XwingDataService) { }

  postDamage() {
    // Get the hull stat
    let hull = this.pilot.stats.find((stat) => stat.type == 'hull');
    // Compute hull remaining based on number of damage cards
    hull.remaining = hull.value - this.pilot.damagecards.length;
    // Calculate points destroyed
    if (hull.remaining <= 0) {
      this.pilot.pointsDestroyed = this.pilot.points;
    } else {
      let totalPoints = hull.value;
      let remainingPoints = hull.remaining;
      let shields = this.pilot.stats.find((stat) => stat.type == 'shields');
      if (shields) {
        totalPoints += shields.value;
        remainingPoints += shields.remaining;
      }
      if (remainingPoints <= totalPoints / 2) {
        this.pilot.pointsDestroyed = Math.ceil(this.pilot.points / 2);
      }
    }
    this.squadron.pointsDestroyed = 0;
    this.squadron.pilots.forEach(
      (pilot) => {
        this.squadron.pointsDestroyed += pilot.pointsDestroyed;
      }
    )
    if (this.squadron.pointsDestroyed == this.squadron.points) {
      this.squadron.pointsDestroyed = 200;
    }
  }

  drawHit() {
    let card = this.squadron.damagedeck.shift();
    if (card) {
      card.exposed = false;
      this.pilot.damagecards.push(card);
      this.postDamage();
    } else {
      this.presentDamageDeckEmpty();
    }
  }

  drawCrit() {
    let card = this.squadron.damagedeck.shift();
    if (card) {
      card.exposed = true;
      this.pilot.damagecards.push(card);
      this.postDamage();
    } else {
      this.presentDamageDeckEmpty();
    }
  }

  async presentDamageDeckEmpty() {
    const toast = await this.toastController.create({
      message: 'Your Damage Deck is empty.',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async presentPilotActionsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PilotActionsComponent,
      componentProps: {
        pilot: this.pilot,
        squadron: this.squadron
      },
      event: ev
    });
    return await popover.present();
  }


  ngOnInit() {
    console.log("pilot modal", this.pilot, this.squadron);
    // Find stats with tokens to display
    this.shields = this.pilot.stats.find((stat) => stat.type == 'shields');
    this.charges = this.pilot.stats.find((stat) => stat.type == 'charges');
    this.force = this.pilot.stats.find((stat) => stat.type == 'force');

    // Load pilot card
    this.dataService.get_image_by_url(this.pilot.pilot.image).then(
      (url) => {
        this.img_url = url;
      }
    )
  }

}

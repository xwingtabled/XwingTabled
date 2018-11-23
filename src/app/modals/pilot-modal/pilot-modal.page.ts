import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PilotActionsComponent } from '../../pilot-actions/pilot-actions.component';
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
  constructor(public toastController: ToastController, 
              private popoverController: PopoverController,
              private dataService: XwingDataService) { }

  postDamage() {
    this.pilot.hull.remaining = this.pilot.hull.value - this.pilot.damagecards.length;
    if (this.pilot.hull.remaining <= 0) {
      this.pilot.pointsDestroyed = this.pilot.points;
    } else {
      let totalPoints = this.pilot.hull.value;
      let remainingPoints = this.pilot.hull.remaining;
      if (this.pilot.shields) {
        totalPoints += this.pilot.shields.value;
        remainingPoints += this.pilot.shields.remaining;
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
    let card = this.drawRandom(this.squadron.damagedeck);
    if (card) {
      card.exposed = false;
      this.pilot.damagecards.push(card);
      this.postDamage();
    } else {
      this.presentDamageDeckEmpty();
    }
  }

  drawCrit() {
    let card = this.drawRandom(this.squadron.damagedeck);
    if (card) {
      card.exposed = true;
      this.pilot.damagecards.push(card);
      this.postDamage();
    } else {
      this.presentDamageDeckEmpty();
    }
  }

  drawRandom(damagecards: any[]) {
    if (damagecards.length == 0) {
      return null;
    }
    let index = Math.floor(Math.random() * Math.floor(damagecards.length));
    let card = damagecards[index];
    damagecards.splice(index, 1);
    return card;
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
    this.dataService.get_image_by_url(this.pilot.pilot.image).then(
      (url) => {
        this.img_url = url;
      }
    )
  }

}

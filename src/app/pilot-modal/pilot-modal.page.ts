import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { DamagePopoverComponent } from '../components/damage-popover/damage-popover.component';
@Component({
  selector: 'app-pilot-modal',
  templateUrl: './pilot-modal.page.html',
  styleUrls: ['./pilot-modal.page.scss'],
})
export class PilotModalPage implements OnInit {
  pilot;
  squadron;

  constructor(public toastController: ToastController, private popoverController: PopoverController) { }

  postDamage() {
    this.pilot.hull.remaining = this.pilot.hull.value - this.pilot.damagecards.length;
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

  hitCardAvailable() : boolean {
    let result = false;
    this.pilot.damagecards.forEach(
      (card) => {
        if (!card.exposed) {
          result = true;
        }
      }
    )
    return result;
  }

  async presentDamageDeckEmpty() {
    const toast = await this.toastController.create({
      message: 'Your Damage Deck is empty.',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async exposeRandomHit() {
    let hitIndexes: number[] = [];
    for (let i = 0; i < this.pilot.damagecards.length; i++) {
      if (!this.pilot.damagecards[i].exposed) {
        hitIndexes.push(i);
      }
    }
    let index = hitIndexes[Math.floor(Math.random() * Math.floor(hitIndexes.length))];
    let card = this.pilot.damagecards[index];
    this.pilot.damagecards.splice(index, 1);
    card.exposed = true;
    const popover = await this.popoverController.create({
      component: DamagePopoverComponent,
      componentProps: {
        card: card,
        squadron: this.squadron
      }
    });
    this.pilot.damagecards.push(card);
    return await popover.present();
  }

  ngOnInit() {
    console.log("pilot modal", this.pilot, this.squadron);
  }

}

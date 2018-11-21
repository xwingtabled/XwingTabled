import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pilot-modal',
  templateUrl: './pilot-modal.page.html',
  styleUrls: ['./pilot-modal.page.scss'],
})
export class PilotModalPage implements OnInit {
  pilot;
  squadron;

  constructor(public toastController: ToastController) { }

  postDamage() {
    // Puts all crits at front of damage pile, randomizes hits at back of damage pile
    let hits = [];
    let crits = [];

    // Sort cards into hits and crits
    this.pilot.damagecards.forEach(
      (card) => {
        if (card.exposed) {
          crits.push(card);
        } else {
          hits.push(card);
        }
      }
    )
    // Randomly draw hit cards into end of crit list
    while (hits.length > 0) {
      crits.push(this.drawRandom(hits));
    }
    // Crit list is the new damage card list
    this.pilot.damagecards = crits;
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

  async presentDamageDeckEmpty() {
    const toast = await this.toastController.create({
      message: 'Your Damage Deck is empty.',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  ngOnInit() {
    console.log("pilot modal", this.pilot, this.squadron);
  }

}

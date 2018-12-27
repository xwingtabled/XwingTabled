import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'xws-damage-deck-actions',
  templateUrl: './damage-deck-actions.component.html',
  styleUrls: ['./damage-deck-actions.component.scss']
})
export class DamageDeckActionsComponent implements OnInit {
  squadron;

  constructor(private events: Events, 
              private toastController: ToastController,
              private popoverController: PopoverController) { }

  ngOnInit() {
  }

  async toastDamageDeck(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    return toast.present();
  }

  async shuffleDiscarded() {
    await this.popoverController.dismiss();
    this.squadron.damagediscard.forEach(
      (card) => {
        this.squadron.damagedeck.push(card);
      }
    )
    this.squadron.damagediscard = [ ];
    this.events.publish("damagedeck", "shuffle");
    this.events.publish("snapshot", "Shuffled discarded Damage Cards");
  }

  async shuffleDeck() {
    await this.popoverController.dismiss();
    this.events.publish("damagedeck", "shuffle");
  }

}

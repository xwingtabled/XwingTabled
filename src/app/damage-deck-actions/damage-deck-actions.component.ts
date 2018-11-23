import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'xws-damage-deck-actions',
  templateUrl: './damage-deck-actions.component.html',
  styleUrls: ['./damage-deck-actions.component.scss']
})
export class DamageDeckActionsComponent implements OnInit {
  squadron;

  constructor(private events: Events) { }

  ngOnInit() {
  }

  destroyedAvailable() : boolean {
    let available = false;
    this.squadron.pilots.forEach(
      (pilot) => {
        if (pilot.hull.remaining <= 0 && pilot.damagecards.length > 0) {
          available = true;
        }
      }
    )
    return available;
  }

  discardDestroyed() {
    this.squadron.pilots.forEach(
      (pilot) => {
        if (pilot.hull.remaining <= 0) {
          pilot.damagecards.forEach(
            (card) => {
              this.squadron.damagediscard.push(card);
            }
          )
          pilot.damagecards = [ ];
        }
      }
    )
    this.events.publish("snapshot", "create snapshot");
  }

  shuffleDiscarded() {
    this.squadron.damagediscard.forEach(
      (card) => {
        this.squadron.damagedeck.push(card);
      }
    )
    this.squadron.damagediscard = [ ];
    this.events.publish("snapshot", "create snapshot");
  }

  shuffleDeck() {
    // Cards are dealt randomly, but if it makes
    // someone feel better then this is a proper
    // shuffle command
    let newDeck = [ ];
    while (this.squadron.damagedeck.length > 0) {
      let index = Math.floor(Math.random() * Math.floor(this.squadron.damagedeck.length));
      let card = this.squadron.damagedeck[index];
      this.squadron.damagedeck.splice(index, 1);
      newDeck.push(card);
    }
    this.squadron.damagedeck = newDeck;
  }

}

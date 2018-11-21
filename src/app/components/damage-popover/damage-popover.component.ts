import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'xws-damage-popover',
  templateUrl: './damage-popover.component.html',
  styleUrls: ['./damage-popover.component.scss']
})
export class DamagePopoverComponent implements OnInit {
  card;
  squadron;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  repair() {
    if (this.card.exposed) {
      this.card.exposed = false;
    } else {
      // Search for the damage card on each pilot and delete it
      this.squadron.pilots.forEach(
        (pilot) => {
          let index = pilot.damagecards.indexOf(this.card);
          if (index > -1) {
            pilot.damagecards.splice(index, 1);
          }
        }
      )
      // Move discarded cards to damage discard pile
      this.squadron.damagediscard.push(this.card);
      this.popoverController.dismiss();
    }
  }

  expose() {
    this.card.exposed = true;
  }

}

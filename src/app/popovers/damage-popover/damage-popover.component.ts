import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NgZone } from '@angular/core';

@Component({
  selector: 'xws-damage-popover',
  templateUrl: './damage-popover.component.html',
  styleUrls: ['./damage-popover.component.scss']
})
export class DamagePopoverComponent implements OnInit {
  card;
  squadron;
  constructor(private popoverController: PopoverController, private ngZone: NgZone) { }

  ngOnInit() {
  }

  mutateCard() {
    this.squadron.pilots.forEach(
      (pilot) => {
        let cardCopy = JSON.parse(JSON.stringify(this.card));
        let index = pilot.damagecards.indexOf(this.card);
        if (index > -1) {
          pilot.damagecards.splice(index, 1);
          pilot.damagecards.splice(index, 0, cardCopy);
        }
      }
    ) 
  }

  repair() {
    this.ngZone.run(
      () => {
        if (this.card.exposed) {
          this.card.exposed = false;
          this.mutateCard();
        } else {
          this.popoverController.dismiss();
          // Search for the damage card on each pilot and delete it
          this.squadron.pilots.forEach(
            (pilot) => {
              let index = pilot.damagecards.indexOf(this.card);
              if (index > -1) {
                pilot.damagecards.splice(index, 1);
                let hullstat = pilot.stats.find((stat) => { return stat['type'] == "hull" });
                hullstat.remaining = hullstat.value - pilot.damagecards.length;
              }
            }
          )
          // Move discarded cards to damage discard pile
          this.squadron.damagediscard.push(this.card);
        }
      }
    )
  }

  expose() {
    this.ngZone.run(
      () => {
        this.card.exposed = true;
        this.mutateCard();
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingStateService } from '../../services/xwing-state.service';

@Component({
  selector: 'xws-damage-popover',
  templateUrl: './damage-popover.component.html',
  styleUrls: ['./damage-popover.component.scss']
})
export class DamagePopoverComponent implements OnInit {
  card;
  squadronUUID: string;
  squadron: any;

  constructor(private popoverController: PopoverController, 
              private ngZone: NgZone,
              private state: XwingStateService) { }

  ngOnInit() {
    this.squadron = this.state.getSquadron(this.squadronUUID);
  }

  mutateCard() {
    this.squadron.pilots.forEach(
      (pilot) => {
        let cardCopy = JSON.parse(JSON.stringify(this.card));
        let index = pilot.damagecards.indexOf(this.card);
        if (index > -1) {
          pilot.damagecards.splice(index, 1);
          pilot.damagecards.splice(index, 0, cardCopy);
          pilot.damagecards = JSON.parse(JSON.stringify(pilot.damagecards));
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
              }
            }
          )
          // Move discarded cards to damage discard pile
          this.state.discard(this.squadronUUID, this.card);
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

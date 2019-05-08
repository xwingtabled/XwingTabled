import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingStateService, DamageCard } from '../../services/xwing-state.service';
import { XwingDataService } from '../../services/xwing-data.service';
import { FirebaseService } from '../../services/firebase.service';
@Component({
  selector: 'xws-damage-popover',
  templateUrl: './damage-popover.component.html',
  styleUrls: ['./damage-popover.component.scss']
})
export class DamagePopoverComponent implements OnInit {
  cardIndex: number;
  pilotUUID: string;
  squadronUUID: string;
  squadron: any;
  card: any = { };
  cardData: any = { };
  selected_card: DamageCard = null;
  schroedinger_cards: DamageCard[] = [ ];

  constructor(private popoverController: PopoverController, 
              private ngZone: NgZone,
              public state: XwingStateService,
              private dataService: XwingDataService) { }

  ngOnInit() {
    this.squadron = this.state.getSquadron(this.squadronUUID);
    this.card = this.state.getDamageCard(this.squadronUUID, this.pilotUUID, this.cardIndex);
    if (this.card.title) {
      this.cardData = this.dataService.getDamageCardData(this.card.title);
    }
    if (this.squadron.schroedinger) {
      // Fill cards with unique titles from damage deck
      this.squadron.damagedeck.forEach(
        (draw) => {
          let found = this.schroedinger_cards.find(card => draw.title == card.title);
          if (!found) {
            this.schroedinger_cards.push(draw);
          }
        }
      );
      this.schroedinger_cards.sort((a, b) => { return a.title.localeCompare(b.title) });
    }
  }


  repair() {
    this.ngZone.run(
      () => {
        if (this.card.exposed) {
          this.card.exposed = false;
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
        this.state.snapshot(this.squadronUUID);
      }
    )
  }

  expose() {
    this.ngZone.run(
      () => {
        this.card.exposed = true;
        if (!this.card.title) {
          let crit = this.state.getRandomDamageCard(this.squadronUUID);
          this.card.title = crit.title;
          this.cardData = this.dataService.getDamageCardData(crit.title);
        }
        this.state.snapshot(this.squadronUUID);
      }
    )
  }

  changeEvent(event) {
    this.selected_card = event.detail.value;
  }

  selectCard() {
    this.card.exposed = true;
    this.card.title = this.selected_card.title;
    this.cardData = this.dataService.getDamageCardData(this.card.title);
    for (let i = 0; i < this.squadron.damagedeck.length; i++) {
      if (this.squadron.damagedeck[i].title == this.selected_card.title) {
        this.squadron.damagedeck.splice(i, 1);
        return;
      }
    }
  }

}

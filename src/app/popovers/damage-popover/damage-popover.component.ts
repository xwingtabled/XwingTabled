import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingStateService } from '../../services/xwing-state.service';
import { XwingDataService } from '../../services/xwing-data.service';
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

  constructor(private popoverController: PopoverController, 
              private ngZone: NgZone,
              private state: XwingStateService,
              private dataService: XwingDataService) { }

  ngOnInit() {
    this.squadron = this.state.getSquadron(this.squadronUUID);
    this.card = this.state.getDamageCard(this.squadronUUID, this.pilotUUID, this.cardIndex);
    this.cardData = this.dataService.getDamageCardData(this.card.title);
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
      }
    )
  }

  expose() {
    this.ngZone.run(
      () => {
        this.card.exposed = true;
      }
    )
  }

}

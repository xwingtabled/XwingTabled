import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DamagePopoverComponent } from '../components/damage-popover/damage-popover.component';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-pilot-actions',
  templateUrl: './pilot-actions.component.html',
  styleUrls: ['./pilot-actions.component.scss']
})
export class PilotActionsComponent implements OnInit {
  pilot;
  squadron;

  constructor(private popoverController: PopoverController, private ngZone: NgZone) { }

  ngOnInit() {
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

  mutateCard(card: any) {
    this.squadron.pilots.forEach(
      (pilot) => {
        let cardCopy = JSON.parse(JSON.stringify(card));
        let index = pilot.damagecards.indexOf(card);
        if (index > -1) {
          pilot.damagecards.splice(index, 1);
          pilot.damagecards.splice(index, 0, cardCopy);
        }
      }
    ) 
  }

  exposeRandomHit() {
    this.popoverController.dismiss();
    this.ngZone.run(
      async () => {
        let hitIndexes: number[] = [];
        for (let i = 0; i < this.pilot.damagecards.length; i++) {
          if (!this.pilot.damagecards[i].exposed) {
            hitIndexes.push(i);
          }
        }
        let index = hitIndexes[Math.floor(Math.random() * Math.floor(hitIndexes.length))];
        let card = this.pilot.damagecards[index];
        card.exposed = true;
        this.mutateCard(card);
        const popover = await this.popoverController.create({
          component: DamagePopoverComponent,
          componentProps: {
            card: card,
            squadron: this.squadron
          }
        });
        await popover.present();
      }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DamagePopoverComponent } from '../damage-popover/damage-popover.component';
import { MovementChartComponent } from '../movement-chart/movement-chart.component';
import { ConditionMenuComponent } from '../condition-menu/condition-menu.component';
import { NgZone } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-pilot-actions',
  templateUrl: './pilot-actions.component.html',
  styleUrls: ['./pilot-actions.component.scss']
})
export class PilotActionsComponent implements OnInit {
  pilot;
  squadron;

  constructor(private popoverController: PopoverController,
              private alertController: AlertController,
              private ngZone: NgZone) { }

  ngOnInit() {
  }

  recycleAvailable() : boolean {
    return this.pilot.hull.remaining <= 0 && this.pilot.damagecards.length > 0;
  }

  async recycleDamageCards() {
    await this.popoverController.dismiss();
    this.squadron.damagediscard = this.squadron.damagediscard.concat(this.pilot.damagecards);
    this.pilot.damagecards = [ ];
  }

  async assignIdNumber() {
    await this.popoverController.dismiss();
    let alert = await this.alertController.create({
      header: 'Assign ID',
      message: 'Which ID/Lock token number should this pilot have?',
      inputs: [
        {
          name: 'id',
          type: "number"
        }
      ],
      buttons: [
        { text: 'OK',
          handler: (data) => { 
            this.ngZone.run(
              () => {
                if (data.id > 0) {
                  this.pilot.idNumber = data.id;
                } else {
                  this.pilot.idNumber = -1;
                }
              }
            )
          }
        },
        { text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary' }
      ]
    });
    return await alert.present(); 
  }

  async showConditionMenu() {
    await this.popoverController.dismiss();
    const popover = await this.popoverController.create({
      component: ConditionMenuComponent,
      componentProps: {
        pilot: this.pilot
      }
    });
    await popover.present();
  }

  async showMovementChart(){
    await this.popoverController.dismiss();
    const popover = await this.popoverController.create({
      component: MovementChartComponent,
      componentProps: {
        dial: this.pilot.ship.dial,
        name: this.pilot.ship.name
      }
    });
    await popover.present();
  }

  fleeShip() {
    this.popoverController.dismiss();
    this.pilot.pointsDestroyed = this.pilot.points;
    this.squadron.pointsDestroyed = 0;
    this.squadron.pilots.forEach(
      (pilot) => {
        this.squadron.pointsDestroyed += pilot.pointsDestroyed;
      }
    )
    if (this.squadron.pointsDestroyed == this.squadron.points) {
      this.squadron.pointsDestroyed = 200;
    }
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
    let cardCopy = JSON.parse(JSON.stringify(card));
    let index = this.pilot.damagecards.indexOf(card);
    if (index > -1) {
      this.pilot.damagecards.splice(index, 1);
      this.pilot.damagecards.splice(index, 0, cardCopy);
    }
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
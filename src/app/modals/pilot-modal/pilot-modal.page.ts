import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { ConditionMenuComponent } from '../../popovers/condition-menu/condition-menu.component';
import { DamagePopoverComponent } from '../../popovers/damage-popover/damage-popover.component';
@Component({
  selector: 'app-pilot-modal',
  templateUrl: './pilot-modal.page.html',
  styleUrls: ['./pilot-modal.page.scss'],
})
export class PilotModalPage implements OnInit {
  pilot;
  squadron;
  img_url: string = null;
  card_text: string = null;

  shields: any = null;
  charges: any = null;
  force: any = null;

  maneuverChart: any[] = new Array(7);

  constructor(public toastController: ToastController, 
              private popoverController: PopoverController,
              private dataService: XwingDataService,
              private alertController: AlertController,
              private ngZone: NgZone) { }

  async postDamage() {
    // Get the hull stat
    let hull = this.pilot.stats.find((stat) => stat.type == 'hull');
    // Compute hull remaining based on number of damage cards
    hull.remaining = hull.value - this.pilot.damagecards.length;
    // Calculate points destroyed
    if (hull.remaining <= 0) {
      this.pilot.pointsDestroyed = this.pilot.points;
      const toast = await this.toastController.create({
        message: this.pilot.ship.name + " destroyed",
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    } else {
      let totalPoints = hull.value;
      let remainingPoints = hull.remaining;
      let shields = this.pilot.stats.find((stat) => stat.type == 'shields');
      if (shields) {
        totalPoints += shields.value;
        remainingPoints += shields.remaining;
      }
      if (remainingPoints <= totalPoints / 2) {
        this.pilot.pointsDestroyed = Math.ceil(this.pilot.points / 2);
        const toast = await this.toastController.create({
          message: this.pilot.ship.name + " at half points",
          duration: 2000,
          position: 'middle'
        });
        toast.present();
      }
    }
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

  drawHit() {
    let card = this.squadron.damagedeck.shift();
    if (card) {
      card.exposed = false;
      this.pilot.damagecards.push(card);
      this.postDamage();
    } else {
      this.presentDamageDeckEmpty();
    }
  }

  drawCrit() {
    let card = this.squadron.damagedeck.shift();
    if (card) {
      card.exposed = true;
      this.pilot.damagecards.push(card);
      this.postDamage();
    } else {
      this.presentDamageDeckEmpty();
    }
  }

  async presentDamageDeckEmpty() {
    const toast = await this.toastController.create({
      message: 'Your Damage Deck is empty.',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  recycleAvailable() : boolean {
    let hull = this.pilot.stats.find((stat) => stat.type == 'hull');
    return hull.remaining <= 0 && this.pilot.damagecards.length > 0;
  }

  async recycleDamageCards() {
    this.pilot.damagecards.forEach(
      (card) => {
        card.exposed = false;
      }
    )
    this.squadron.damagediscard = this.squadron.damagediscard.concat(this.pilot.damagecards);
    this.pilot.damagecards = [ ];
  }

  async assignIdNumber() {
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
    const popover = await this.popoverController.create({
      component: ConditionMenuComponent,
      componentProps: {
        pilot: this.pilot,
        squadron: this.squadron
      }
    });
    await popover.present();
  }

  fleeShip() {
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

  ngOnInit() {
    console.log("pilot modal", this.pilot);
    // Find stats with tokens to display
    this.shields = this.pilot.stats.find((stat) => stat.type == 'shields');
    this.charges = this.pilot.stats.find((stat) => stat.type == 'charges');
    this.force = this.pilot.stats.find((stat) => stat.type == 'force');

    this.fillManeuverChart(this.pilot.ship.dial);

    // Load pilot card
    if (this.pilot.pilot.image) {
      this.dataService.get_image_by_url(this.pilot.pilot.image).then(
        (url) => {
          this.img_url = url;
        },
        (error) => {
        }
      );
    }
  }

  fillManeuverChart(dial: string[]) {
    // Fill maneuver chart
    // map is for middle letter of maneuver code
    // 2NB would be 2 bank left blue
    let map: any = {
      "O" : { name: "stop", index: 2 },
      "F" : { name: "straight", index: 2 },
      "B" : { name: "bankleft", index: 1 },
      "N" : { name: "bankright", index: 3 },
      "T" : { name: "turnleft", index: 0 },
      "Y" : { name: "turnright", index: 4 },
      "K" : { name: "kturn", index: 5 },
      "S" : { name: "reversestraight", index: 2 },
      "E" : { name: "trollleft", index: 5 },
      "R" : { name: "trollright", index: 6 },
      "L" : { name: "sloopleft", index: 5 },
      "P" : { name: "sloopright", index: 6 },
      "A" : { name: "reversebankleft", index: 1 },
      "D" : { name: "reversebankright", index: 3 } 
    }
    for (let i = 0; i < 8; i++) {
      let speed = (7 - i) - 2;
      this.maneuverChart[i] = { speed: speed, maneuvers: new Array(7) };
    }
    dial.forEach(
      (maneuverCode: string) => {
        let difficulty = "white";
        if (maneuverCode[2] == 'R') {
          difficulty = "red"
        }
        if (maneuverCode[2] == 'B') {
          difficulty = "blue"
        }
        let index = map[maneuverCode[1]].index;
        let name = map[maneuverCode[1]].name;
        let speed = parseInt(maneuverCode[0]);
        let row: any = this.maneuverChart.find((row) => row.speed == speed);
        let maneuver = { name: name, difficulty: difficulty };
        row.maneuvers[index] = maneuver;
      }
    )
  }

  hasManeuvers(row: any) : boolean {
    let maneuvers = row.maneuvers;
    for (let cell of maneuvers) {
      if (cell) {
        return true;
      }
    }
    return false;
  }
}

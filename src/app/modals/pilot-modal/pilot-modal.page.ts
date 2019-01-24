import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { XwingStateService } from '../../services/xwing-state.service';
import { ConditionMenuComponent } from '../../popovers/condition-menu/condition-menu.component';
import { DamagePopoverComponent } from '../../popovers/damage-popover/damage-popover.component';
import { DamageCardSelectComponent } from '../../popovers/damage-card-select/damage-card-select.component';
import { AssignIdPopoverComponent } from '../../popovers/assign-id-popover/assign-id-popover.component';
import { ModalController } from '@ionic/angular';
import { LayoutService } from '../../services/layout.service';
import { ActivatedRoute, Router } from "@angular/router";
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pilot-modal',
  templateUrl: './pilot-modal.page.html',
  styleUrls: ['./pilot-modal.page.scss'],
})
export class PilotModalPage implements OnInit {
  pilot;
  img_url: string = null;
  card_text: string = null;

  shields: any = null;
  charges: any = null;
  force: any = null;
  faBars = faBars;
  expanded: boolean = false;
  useAngularRouter: boolean = false;

  maneuverChart: any[] = new Array(7);

  constructor(public toastController: ToastController, 
              private popoverController: PopoverController,
              private dataService: XwingDataService,
              public state: XwingStateService,
              private alertController: AlertController,
              private events: Events,
              private ngZone: NgZone,
              public modalController: ModalController,
              public layout: LayoutService,
              private route: ActivatedRoute,
              private router: Router) { }


  drawHit() {
    if (!this.state.drawHit(this.pilot)) {
      this.presentDamageDeckEmpty();
    }
  }

  drawCrit() {
    if (!this.state.drawCrit(this.pilot)) {
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
        this.state.discard(card);
      }
    )
    this.pilot.damagecards = [ ];
  }

  async assignIdNumber() {
    const popover = await this.popoverController.create({
      component: AssignIdPopoverComponent,
      componentProps: {
        id: this.pilot.idNumber,
      }
    });
    popover.onDidDismiss().then(
      (result) => {
        console.log(result);
        this.pilot.idNumber = result.data
      }
    )
    await popover.present();  
  }

  async thaneKyrell() {
    const popover = await this.popoverController.create({
      component: DamageCardSelectComponent,
      componentProps: {
        title: "Thane Kyrell",
        cards: this.pilot.damagecards.filter((card) => !card.exposed),
        callback: (card) => {
          card.exposed = true;
        }
      }
    });
    await popover.present(); 
  }

  async maarekStele() {
    let cards = [ ];
    for (let i = 0; i < 3 && this.state.damagedeck.length; i++) {
      cards.push(this.state.draw());
    }
    const popover = await this.popoverController.create({
      component: DamageCardSelectComponent,
      componentProps: {
        title: "Maarek Stele",
        cards: cards,
        callback: (card) => {
          card.exposed = true;
          this.pilot.damagecards.push(card);
          cards.forEach(
            (remaining) => {
              if (remaining != card) {
                this.state.discard(remaining);
              }
            }
          );
        }
      }
    });
    await popover.present(); 
  }

  async assignCrit() {
    let cards = [ ];
    // Fill cards with unique titles from damage deck
    this.state.damagedeck.forEach(
      (draw) => {
        let found = cards.find(card => draw.title == card.title);
        if (!found) {
          cards.push(draw);
        }
      }
    );

    cards.sort((a, b) => { return a.title.localeCompare(b.title) });

    const popover = await this.popoverController.create({
      component: DamageCardSelectComponent,
      componentProps: {
        title: "Assign Crit",
        cards: cards,
        callback: (card) => {
          card.exposed = true;
          this.pilot.damagecards.push(card);
          let index = this.state.damagedeck.indexOf(card);
          this.state.damagedeck.splice(index, 1);
       }
      }
    });
    await popover.present();  
  }

  async showConditionMenu() {
    const popover = await this.popoverController.create({
      component: ConditionMenuComponent,
      componentProps: {
        pilot: this.pilot
      }
    });
    await popover.present();
  }

  expandToggle() {
    this.expanded = !this.expanded;
  }

  fleeShip() {
    this.pilot.pointsDestroyed = this.pilot.points;
    this.state.squadron.pointsDestroyed = 0;
    this.state.squadron.pilots.forEach(
      (pilot) => {
        this.state.squadron.pointsDestroyed += pilot.pointsDestroyed;
      }
    )
    if (this.state.squadron.pointsDestroyed == this.state.squadron.points) {
      this.state.squadron.pointsDestroyed = 200;
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
            card: card
          }
        });
        await popover.present();
      }
    )
  }

  ngOnInit() {
    let pilotNum = this.route.snapshot.paramMap.get("pilotNum");
    if (pilotNum) {
      this.useAngularRouter = true;
      this.pilot = this.state.squadron.pilots.find(pilot => pilot.num == pilotNum);
    }
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

  dismiss() {
    if (this.useAngularRouter) {
      this.router.navigateByUrl("/");
    } else {
      this.modalController.dismiss();
    }
  }
}

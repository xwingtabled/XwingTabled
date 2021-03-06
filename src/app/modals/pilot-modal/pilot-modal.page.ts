import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { XwingStateService, DamageCard, Pilot, Squadron } from '../../services/xwing-state.service';
import { ConditionMenuComponent } from '../../popovers/condition-menu/condition-menu.component';
import { DamagePopoverComponent } from '../../popovers/damage-popover/damage-popover.component';
import { DamageCardSelectComponent } from '../../popovers/damage-card-select/damage-card-select.component';
import { AssignIdPopoverComponent } from '../../popovers/assign-id-popover/assign-id-popover.component';
import { ModalController } from '@ionic/angular';
import { LayoutService } from '../../services/layout.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { faBars, faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-pilot-modal',
  templateUrl: './pilot-modal.page.html',
  styleUrls: ['./pilot-modal.page.scss'],
})
export class PilotModalPage implements OnInit {
  pilot: Pilot;
  squadron: Squadron;
  pilotUUID: string;
  squadronUUID: string;
  img_url: string = null;
  data: any = null;
  faBars = faBars;
  faChevronCircleUp = faChevronCircleUp;
  faChevronCircleDown = faChevronCircleDown;
  expanded: boolean = false;
  useAngularRouter: boolean = false;
  tab: string = "tokens";
  expandCard: boolean = false;
  expandDial: boolean = false;
  shieldTotal: number = 0;
  chargeTotal: number = 0;
  forceTotal: number = 0;

  maneuverChart: any[] = [ ];

  constructor(public toastController: ToastController, 
              private popoverController: PopoverController,
              private dataService: XwingDataService,
              public state: XwingStateService,
              private events: Events,
              private ngZone: NgZone,
              public modalController: ModalController,
              public layout: LayoutService,
              private route: ActivatedRoute,
              private location: Location,
              private firebase: FirebaseService) { }

  ngOnInit() {
    let squadronUUIDParam = this.route.snapshot.paramMap.get("squadronUUID");
    let pilotUUIDParam = this.route.snapshot.paramMap.get("pilotUUID");
    if (squadronUUIDParam && pilotUUIDParam) {
      this.squadronUUID = squadronUUIDParam;
      this.pilotUUID = pilotUUIDParam;
      this.useAngularRouter = true;
    }
    this.initialize();
  }

  ionViewWillEnter() {
    this.events.subscribe(this.state.topic,
      (data) => {
        this.initialize();
      }
    );
  }

  ionViewWillLeave() {
    this.events.unsubscribe(this.state.topic);
  }

  push() {
    this.state.snapshot(this.squadronUUID);
  }

  initialize() {
    this.squadron = this.state.getSquadron(this.squadronUUID);
    this.pilot = this.state.getPilot(this.squadronUUID, this.pilotUUID);

    this.data = this.dataService.getCardByFFG(this.pilot.ffg);
   
    this.shieldTotal = this.dataService.getStatTotal(this.pilot, 'shields');
    this.forceTotal = this.dataService.getStatTotal(this.pilot, 'force');

    let chargeStat = this.dataService.getFFGCardStat(this.pilot.ffg, 'charge');
    if (chargeStat) {
      this.chargeTotal = parseInt(chargeStat.value);
    }

    this.fillManeuverChart(this.data.metadata.dial);
    // Load pilot card
    if (this.data.card_image) {
      this.dataService.get_image_by_url(this.data.card_image).then(
        (url) => {
          this.img_url = url;
        },
        (error) => {
        }
      );
    }
  }

  toggleDial() {
    this.expandDial = !this.expandDial;
  }

  toggleCard() {
    this.expandCard = !this.expandCard;
  }

  cardExpandClass() {
    if (this.expandCard) {
      return "expand";
    }
    if (this.expandDial) {
      return "hidden";
    }
    return "";
  }
  
  dialExpandClass() {
    if (this.expandDial) {
      return "expand";
    }
    if (this.expandCard) {
      return "hidden";
    }
    return "";
  }

  leftExpandClass() {
    return this.expandCard || this.expandDial ? "expand" : "";
  }

  showRightColumn() {
    return !this.expandDial && !this.expandCard;
  }

  showCard() {
    return !this.expandDial;
  }

  showDial() {
    return !this.expandCard;
  }

  showFooter() {
    return !this.expandCard && !this.expandDial;
  }

  changeShields(remaining) {
    this.pilot.shields = remaining;
    this.push();
  }

  changeCharges(remaining) {
    this.pilot.charges = remaining;
    this.push();
  }

  changeForce(remaining) {
    this.pilot.force = remaining;
    this.push();
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

    let maneuvers = new Array(7);

    for (let i = 0; i < 8; i++) {
      let speed = (7 - i) - 2;
      maneuvers[i] = { speed: speed, maneuvers: new Array(7) };
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
        let row: any = maneuvers.find((row) => row.speed == speed);
        let maneuver = { name: name, difficulty: difficulty };
        row.maneuvers[index] = maneuver;
      }
    )

    maneuvers.forEach(
      (row) => {
        if (this.hasManeuvers(row)) {
          this.maneuverChart.push(row);
        }
      }
    )

    this.maneuverChart.sort((a, b) => { return b.speed - a.speed });

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


  drawHit() {
    if (!this.state.drawHit(this.squadronUUID, this.pilotUUID)) {
      this.presentDamageDeckEmpty();
    }
    this.push();
  }

  drawCrit() {
    if (!this.state.drawCrit(this.squadronUUID, this.pilotUUID)) {
      this.presentDamageDeckEmpty();
    }
    this.push();
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
    return this.dataService.isDestroyed(this.pilot);
  }

  async recycleDamageCards() {
    this.pilot.damagecards.forEach(
      (card) => {
        card.exposed = false;
        this.state.discard(this.squadronUUID, card);
      }
    )
    this.pilot.damagecards = [ ];
    this.push();
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
        this.pilot.idNumber = result.data;
        this.push();
      }
    )
    await popover.present();  
  }

  async thaneKyrell() {
    this.pilot.damagecards.forEach(
      (card) => {
        if (!card.exposed) {
          let crit = this.state.getRandomDamageCard(this.squadronUUID);
          card.title = crit.title;
        }
      }
    )
    const popover = await this.popoverController.create({
      component: DamageCardSelectComponent,
      componentProps: {
        title: "Thane Kyrell",
        cards: this.pilot.damagecards.filter((card) => !card.exposed),
        callback: (card) => {
          card.exposed = true;
          this.push();
        }
      }
    });
    await popover.present(); 
  }

  async maarekStele() {
    let cards: DamageCard[ ] = [ ];
    for (let i = 0; i < 3 && this.squadron.damagedeck.length; i++) {
      let card: DamageCard = null;
      if (this.squadron.schroedinger) {
        card = this.state.getRandomDamageCard(this.squadronUUID);
      } else {
        card = this.state.draw(this.squadronUUID);
      }
      cards.push(card);
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
                remaining.exposed = false;
                if (this.squadron.schroedinger) {
                  this.squadron.damagedeck.push(remaining);
                } else {
                  this.state.discard(this.squadronUUID, remaining);
                }
              }
            }
          );
          this.push();
        }
      }
    });
    await popover.present(); 
  }

  async assignCrit() {
    let cards = [ ];
    // Fill cards with unique titles from damage deck
    this.squadron.damagedeck.forEach(
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
          let index = this.squadron.damagedeck.indexOf(card);
          this.squadron.damagedeck.splice(index, 1);
          this.push();
       }
      }
    });
    await popover.present();  
  }

  async showConditionMenu() {
    const popover = await this.popoverController.create({
      component: ConditionMenuComponent,
      componentProps: {
        pilotUUID: this.pilotUUID,
        squadronUUID: this.squadronUUID
      }
    });
    await popover.present();
  }

  expandToggle() {
    this.expanded = !this.expanded;
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
        if (!card.title) {
          let crit = this.state.getRandomDamageCard(this.squadronUUID);
          card.title = crit.title;
        }
        this.mutateCard(card);
        this.push();
        const popover = await this.popoverController.create({
          component: DamagePopoverComponent,
          componentProps: {
            cardIndex: index,
            pilotUUID: this.pilotUUID,
            squadronUUID: this.squadronUUID
          }
        });
        await popover.present();
      }
    )
  } 

  dismiss() {
    if (this.useAngularRouter) {
      this.location.back();
    } else {
      this.modalController.dismiss();
    }
  }
}

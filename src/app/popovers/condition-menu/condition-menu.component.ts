import { Component, OnInit } from '@angular/core';
import { XwingDataService } from '../../services/xwing-data.service';
import { PopoverController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-condition-menu',
  templateUrl: './condition-menu.component.html',
  styleUrls: ['./condition-menu.component.scss']
})
export class ConditionMenuComponent implements OnInit {
  pilot;
  squadron;
  conditions: any[] = [];
  img_urls: any = { };
  selected_condition: any;
  pilotDamageCards: any[] = [];
  darksideXws: string = "illshowyouthedarkside"

  constructor(private dataService: XwingDataService, 
              private popoverController: PopoverController,
              private toastController: ToastController) { }

  async assignCondition() {
    let existing = this.pilot.conditions.find((condition) => condition.xws == this.selected_condition.xws);
    if (!existing) {
      if (this.selected_condition.xws == this.darksideXws && this.selected_condition.pilotDamageCard != null) {
        let index = this.squadron.damage_deck.indexOf(this.selected_condition.pilotDamageCard);
        this.squadron.damage_deck.splice(index, 1);
      }
      this.pilot.conditions.push(this.selected_condition);
      return this.popoverController.dismiss();
    } else {
      const toast = await this.toastController.create({
        message: this.pilot.pilot.name + ' already has ' + this.selected_condition.name,
        duration: 2000,
        position: 'middle'
      });
      return toast.present();
    }
  }

  getPilotDamageCards() {
    this.pilotDamageCards = [ ];
    this.squadron.damage_deck.forEach(
      (damagecard) => {
        if (!this.pilotDamageCards.find((card) => card.name == card.name) && damagecard.type == 'Pilot') {
          this.pilotDamageCards.push(damagecard);
        }
      }
    )
  }

  changeEvent(event) {
    this.selected_condition = this.conditions.find((condition) => condition.xws == event.detail.value);
    if (this.selected_condition.xws == this.darksideXws) {
      this.getPilotDamageCards();
    }
  }

  changeDamageCard(event) {
    this.selected_condition.pilotDamageCard = event.detail.value;
    this.selected_condition.pilotDamageCard.exposed = true;
  }

  ngOnInit() {
    this.dataService.data.conditions.forEach(
      (condition) => {
        // Make a copy of each condition object
        // They need to be their own instances for conditions like
        // "I'll Show You the Dark Side" which can have
        // other objects attached to them such as damage cards
        let conditionObj = JSON.parse(JSON.stringify(condition));
        this.conditions.push(conditionObj);
        // Load artwork and store using xws as the key
        this.dataService.get_image_by_url(conditionObj.artwork).then(
          (url) => {
            this.img_urls[conditionObj.xws] = url;
          }
        );
      }
    );
  }
}

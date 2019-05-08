import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DamageCard } from '../../services/xwing-state.service';

@Component({
  selector: 'app-damage-card-select',
  templateUrl: './damage-card-select.component.html',
  styleUrls: ['./damage-card-select.component.scss']
})
export class DamageCardSelectComponent implements OnInit {
  cards: DamageCard[];
  callback;
  selected_card: DamageCard = null;

  constructor(private popoverController: PopoverController) { }

  changeEvent(event) {
    this.selected_card = event.detail.value;
  }

  async selectCard() {
    this.callback(this.selected_card);
    await this.popoverController.dismiss();
  }

  ngOnInit() {

  }
}

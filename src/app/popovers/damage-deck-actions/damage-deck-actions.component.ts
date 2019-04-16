import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { XwingStateService } from '../../services/xwing-state.service';
@Component({
  selector: 'xws-damage-deck-actions',
  templateUrl: './damage-deck-actions.component.html',
  styleUrls: ['./damage-deck-actions.component.scss']
})
export class DamageDeckActionsComponent implements OnInit {
  squadronUUID: string;
  squadron: any;
  constructor(private events: Events, 
              private toastController: ToastController,
              private popoverController: PopoverController,
              public state: XwingStateService) { }

  ngOnInit() {
    this.squadron = this.state.getSquadron(this.squadronUUID);
  }

  async toastDamageDeck(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    return toast.present();
  }

  async shuffleDiscarded() {
    await this.popoverController.dismiss();
    this.state.shuffleDamageDiscard(this.squadronUUID);
  }

  async shuffleDeck() {
    await this.popoverController.dismiss();
    this.state.shuffleDamageDeck(this.squadronUUID);
  }

}

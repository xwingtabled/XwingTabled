import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { XwingStateService } from '../../services/xwing-state.service';
import { DamagePopoverComponent } from '../../popovers/damage-popover/damage-popover.component';
@Component({
  selector: 'xws-damage-card',
  templateUrl: './damage-card.component.html',
  styleUrls: ['./damage-card.component.scss']
})
export class DamageCardComponent implements OnInit {
  card: any = { };
  @Input() cardIndex: number;
  @Input() pilotUUID: string;
  @Input() squadronUUID: string;
  constructor(private popoverController: PopoverController, public state: XwingStateService) { }

  ngOnInit() {
    this.card = this.state.getDamageCard(this.squadronUUID, this.pilotUUID, this.cardIndex);
  }

  async presentDamagePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: DamagePopoverComponent,
      componentProps: {
        cardIndex: this.cardIndex,
        pilotUUID: this.pilotUUID,
        squadronUUID: this.squadronUUID
      }
    });
    return await popover.present();
  }

}

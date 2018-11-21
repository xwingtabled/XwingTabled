import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DamagePopoverComponent } from '../damage-popover/damage-popover.component';
@Component({
  selector: 'xws-damage-card',
  templateUrl: './damage-card.component.html',
  styleUrls: ['./damage-card.component.scss']
})
export class DamageCardComponent implements OnInit {
  @Input() card: any = { };
  @Input() squadron: any;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  async presentDamagePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: DamagePopoverComponent,
      componentProps: {
        card: this.card,
        squadron: this.squadron
      }
    });
    return await popover.present();
  }

}

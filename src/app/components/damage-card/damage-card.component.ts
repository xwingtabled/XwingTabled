import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DamagePopoverComponent } from '../../popovers/damage-popover/damage-popover.component';
@Component({
  selector: 'xws-damage-card',
  templateUrl: './damage-card.component.html',
  styleUrls: ['./damage-card.component.scss']
})
export class DamageCardComponent implements OnInit {
  @Input() card: any = { };
  @Input() squadronNum: number;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  async presentDamagePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: DamagePopoverComponent,
      componentProps: {
        card: this.card,
        squadron: this.squadronNum
      }
    });
    return await popover.present();
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { XwingModule } from '../components/xwing.module';

import { ConditionMenuComponent } from './condition-menu/condition-menu.component';
import { ConditionPopoverComponent } from './condition-popover/condition-popover.component';
import { DamageDeckActionsComponent } from './damage-deck-actions/damage-deck-actions.component';
import { DamagePopoverComponent } from './damage-popover/damage-popover.component';
import { DamageCardSelectComponent } from './damage-card-select/damage-card-select.component';
import { AssignIdPopoverComponent } from './assign-id-popover/assign-id-popover.component';
import { SharePopoverComponent } from './share-popover/share-popover.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    XwingModule,
    NgxQRCodeModule
  ],
  declarations: [
    ConditionMenuComponent,
    ConditionPopoverComponent,
    DamageDeckActionsComponent,
    DamagePopoverComponent,
    DamageCardSelectComponent,
    AssignIdPopoverComponent,
    SharePopoverComponent
  ],
  exports: [
  ],
  entryComponents: [
    ConditionMenuComponent,
    ConditionPopoverComponent,
    DamageDeckActionsComponent,
    DamagePopoverComponent,
    DamageCardSelectComponent,
    AssignIdPopoverComponent,
    SharePopoverComponent
  ]
})
export class PopoverModule {}

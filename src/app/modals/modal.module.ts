import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { XwsModalPageModule } from './xws-modal/xws-modal.module';
import { UpgradeModalPageModule } from './upgrade-modal/upgrade-modal.module';
import { PilotModalPageModule } from './pilot-modal/pilot-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    XwsModalPageModule,
    UpgradeModalPageModule,
    PilotModalPageModule,
  ],
})
export class ModalModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpgradeModalPageModule } from './upgrade-modal/upgrade-modal.module';
import { PilotModalPageModule } from './pilot-modal/pilot-modal.module';
import { SettingsModalPageModule } from './settings-modal/settings-modal.module';
import { HelpModalPageModule } from './help-modal/help-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpgradeModalPageModule,
    PilotModalPageModule,
    SettingsModalPageModule,
    HelpModalPageModule,
  ],
})
export class ModalModule {}

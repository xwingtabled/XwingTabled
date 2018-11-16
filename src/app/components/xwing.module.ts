import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { XwingIconComponent } from './xwing-icon/xwing-icon.component';
import { XwingShipComponent } from './xwing-ship/xwing-ship.component';
import { XwingTextComponent } from './xwing-text/xwing-text.component';
import { SquadronComponent } from './squadron/squadron.component';
import { PilotComponent } from './pilot/pilot.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { UpgradeCollectionComponent } from './upgrade-collection/upgrade-collection.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    XwingIconComponent, 
    XwingShipComponent,
    XwingTextComponent, 
    SquadronComponent, 
    PilotComponent,
    UpgradeComponent,
    UpgradeCollectionComponent ],
  exports: [
    XwingIconComponent, 
    XwingShipComponent, 
    XwingTextComponent, 
    SquadronComponent, 
    PilotComponent, 
    UpgradeComponent,
    UpgradeCollectionComponent ]
})
export class XwingModule {}

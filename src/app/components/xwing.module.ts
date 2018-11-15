import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { XwingIconComponent } from './xwing-icon/xwing-icon.component';
import { XwingShipComponent } from './xwing-ship/xwing-ship.component';
import { XwingTextComponent } from './xwing-text/xwing-text.component';
import { SquadronComponent } from './squadron/squadron.component';
import { PilotComponent } from './pilot/pilot.component';

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
    PilotComponent ],
  exports: [
    XwingIconComponent, XwingShipComponent, 
    XwingTextComponent, 
    SquadronComponent, 
    PilotComponent]
})
export class XwingModule {}

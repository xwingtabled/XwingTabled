import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { XwingIconComponent } from './xwing-icon/xwing-icon.component';
import { XwingShipComponent } from './xwing-ship/xwing-ship.component';
import { XwingTextComponent } from './xwing-text/xwing-text.component';
import { PilotComponent } from './pilot/pilot.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { ChargeSummaryComponent } from './charge-summary/charge-summary.component';
import { AttackStatsComponent} from './attack-stats/attack-stats.component';
import { ActionComponent } from './action/action.component';
import { ForceSummaryComponent } from './force-summary/force-summary.component';
import { BonusStatsComponent } from './bonus-stats/bonus-stats.component';
import { HullSummaryComponent} from './hull-summary/hull-summary.component';
import { ShieldSummaryComponent } from './shield-summary/shield-summary.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    XwingIconComponent, 
    XwingShipComponent,
    XwingTextComponent, 
    PilotComponent,
    UpgradeComponent,
    ChargeSummaryComponent,
    AttackStatsComponent,
    ActionComponent,
    ForceSummaryComponent,
    BonusStatsComponent,
    HullSummaryComponent,
    ShieldSummaryComponent
  ],
  exports: [
    XwingIconComponent, 
    XwingShipComponent, 
    XwingTextComponent, 
    PilotComponent, 
    UpgradeComponent,
    ChargeSummaryComponent,
    AttackStatsComponent,
    ActionComponent,
    ForceSummaryComponent,
    BonusStatsComponent,
    HullSummaryComponent,
    ShieldSummaryComponent
  ]
})
export class XwingModule {}

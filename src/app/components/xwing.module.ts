import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { XwingIconComponent } from './xwing-icon/xwing-icon.component';
import { XwingShipComponent } from './xwing-ship/xwing-ship.component';
import { XwingTextComponent } from './xwing-text/xwing-text.component';
import { PilotComponent } from './pilot/pilot.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { ActionComponent } from './action/action.component';
import { TokenDisplayComponent } from './token-display/token-display.component';
import { DamageCardComponent } from './damage-card/damage-card.component';
import { ConditionComponent } from './condition/condition.component';
import { StatComponent } from './stat/stat.component';
import { BonusStatsComponent } from './bonus-stats/bonus-stats.component';
@NgModule({
  entryComponents: [
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    XwingIconComponent, 
    XwingShipComponent,
    XwingTextComponent, 
    PilotComponent,
    UpgradeComponent,
    ActionComponent,
    TokenDisplayComponent,
    DamageCardComponent,
    ConditionComponent,
    StatComponent,
    BonusStatsComponent
  ],
  exports: [
    XwingIconComponent, 
    XwingShipComponent, 
    XwingTextComponent, 
    PilotComponent, 
    UpgradeComponent,
    ActionComponent,
    TokenDisplayComponent,
    DamageCardComponent,
    ConditionComponent,
    StatComponent,
    BonusStatsComponent
  ]
})
export class XwingModule {}

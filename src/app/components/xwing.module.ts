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
import { TokenDisplayComponent } from './token-display/token-display.component';
import { ForceBonusComponent } from './force-bonus/force-bonus.component';
import { DamageCardComponent } from './damage-card/damage-card.component';
import { DamageSummaryComponent} from './damage-summary/damage-summary.component';
import { ConditionSummaryComponent } from './condition-summary/condition-summary.component';
import { ConditionComponent } from './condition/condition.component';
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
    ChargeSummaryComponent,
    AttackStatsComponent,
    ActionComponent,
    ForceSummaryComponent,
    BonusStatsComponent,
    HullSummaryComponent,
    ShieldSummaryComponent,
    TokenDisplayComponent,
    ForceBonusComponent,
    DamageCardComponent,
    DamageSummaryComponent,
    ConditionSummaryComponent,
    ConditionComponent
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
    ShieldSummaryComponent,
    TokenDisplayComponent,
    ForceBonusComponent,
    DamageCardComponent,
    DamageSummaryComponent,
    ConditionSummaryComponent,
    ConditionComponent
  ]
})
export class XwingModule {}

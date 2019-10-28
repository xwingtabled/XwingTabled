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
import { PhoneUpgradeComponent } from './phone-upgrade/phone-upgrade.component';
import { SquadronComponent } from './squadron/squadron.component';
import { FormationComponent } from './formation/formation.component';
import { FormationPositionComponent } from './formation-position/formation-position.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  entryComponents: [
  ],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule
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
    BonusStatsComponent,
    PhoneUpgradeComponent,
    SquadronComponent,
    FormationComponent,
    FormationPositionComponent
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
    BonusStatsComponent,
    PhoneUpgradeComponent,
    SquadronComponent,
    FormationComponent
  ]
})
export class XwingModule {}

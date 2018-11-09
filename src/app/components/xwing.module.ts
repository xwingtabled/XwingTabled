import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { XwingIconComponent } from './xwing-icon/xwing-icon.component';
import { XwingTextComponent } from './xwing-text/xwing-text.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [XwingIconComponent, XwingTextComponent],
  exports: [XwingIconComponent, XwingTextComponent]
})
export class XwingModule {}

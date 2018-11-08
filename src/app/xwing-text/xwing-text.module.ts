import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { XwingTextComponent } from './xwing-text.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [XwingTextComponent],
  exports: [XwingTextComponent]
})
export class XwingTextModule {}

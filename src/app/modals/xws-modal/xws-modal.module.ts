import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { XwingModule } from '../../components/xwing.module';
import { XwsModalPage } from './xws-modal.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

const routes: Routes = [
  {
    path: '',
    component: XwsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    XwingModule,
    ZXingScannerModule
  ],
  declarations: [
    XwsModalPage
  ],
  entryComponents: [
    XwsModalPage
  ]
})
export class XwsModalPageModule {}

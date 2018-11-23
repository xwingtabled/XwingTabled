import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UpgradeModalPage } from './upgrade-modal.page';
import { XwingModule } from '../../components/xwing.module';
const routes: Routes = [
  {
    path: '',
    component: UpgradeModalPage
  }
];

@NgModule({
  imports: [
    XwingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    UpgradeModalPage
  ],
  entryComponents: [
    UpgradeModalPage
  ]
})
export class UpgradeModalPageModule {}

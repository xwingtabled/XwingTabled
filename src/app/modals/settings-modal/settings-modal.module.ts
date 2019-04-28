import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SettingsModalPage } from './settings-modal.page';
import { XwingModule } from '../../components/xwing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: SettingsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    XwingModule,
    FontAwesomeModule
  ],
  declarations: [
    SettingsModalPage
  ],
  entryComponents: [
    SettingsModalPage
  ]
})
export class SettingsModalPageModule {}

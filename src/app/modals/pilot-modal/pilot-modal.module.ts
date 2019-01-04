import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PilotModalPage } from './pilot-modal.page';
import { XwingModule } from '../../components/xwing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: PilotModalPage
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
    PilotModalPage
  ],
  entryComponents: [
    PilotModalPage
  ]
})
export class PilotModalPageModule {}

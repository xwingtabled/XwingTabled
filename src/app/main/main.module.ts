import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { XwingModule } from '../components/xwing.module';
import { ProgressBarModule } from 'angular-progress-bar';
import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    XwingModule,
    ProgressBarModule
  ],
  declarations: [MainPage]
})
export class MainPageModule {}

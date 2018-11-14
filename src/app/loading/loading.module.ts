import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { LoadingPage } from './loading.page';
import { XwingModule } from '../components/xwing.module';
import { ProgressBarModule } from 'angular-progress-bar';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoadingPage
      }
    ]),
    XwingModule,
    ProgressBarModule
  ],
  declarations: [LoadingPage],
})
export class LoadingPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PilotModalPage } from './modals/pilot-modal/pilot-modal.page';
import { ModalGuard } from './modal-guard';
import { UpgradeModalPage } from './modals/upgrade-modal/upgrade-modal.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: './main/main.module#MainPageModule' 
  },
  {
    path: 'squadron/:squadronNum',
    loadChildren: './main/main.module#MainPageModule'
  },
  {
    path: 'squadron/:squadronNum/pilot/:pilotNum',
    component: PilotModalPage,
    canActivate: [ModalGuard]
  },
  {
    path: 'squadron/:squadronNum/pilot/:pilotNum/upgrade/:ffg',
    component: UpgradeModalPage,
    canActivate: [ModalGuard]
  },
  {
    path: 'about',
    loadChildren: './about/about.module#AboutPageModule'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

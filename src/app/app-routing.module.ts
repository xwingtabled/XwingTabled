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
    path: 'squadron/:squadronUUID',
    loadChildren: './main/main.module#MainPageModule'
  },
  {
    path: 'squadron/:squadronUUID/pilot/:pilotUUID',
    component: PilotModalPage,
    canActivate: [ModalGuard]
  },
  {
    path: 'squadron/:squadronUUID/pilot/:pilotUUID/upgrade/:ffg',
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

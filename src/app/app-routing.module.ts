import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PilotModalPage } from './modals/pilot-modal/pilot-modal.page';
import { TokenModalPage } from './modals/token-modal/token-modal.page';
import { ModalGuard } from './modal-guard';
import { UpgradeModalPage } from './modals/upgrade-modal/upgrade-modal.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: './main/main.module#MainPageModule' 
  },
  {
    path: 'pilot/:pilotNum/card',
    component: PilotModalPage,
    canActivate: [ModalGuard]
  },
  {
    path: 'pilot/:pilotNum/tokens',
    component: TokenModalPage,
    canActivate: [ModalGuard]
  },
  {
    path: 'pilot/:pilotNum/upgrade/:ffg',
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

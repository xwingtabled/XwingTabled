import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PilotModalPage } from './modals/pilot-modal/pilot-modal.page';
import { ModalGuard } from './modal-guard';
import { PageGuard } from './page-guard';
import { UpgradeModalPage } from './modals/upgrade-modal/upgrade-modal.page';
import { MainPage } from './main/main.page';
import { AddPage } from './add/add.page';
import { QrPage } from './qr/qr.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'squadron/:squadronUUID',
    component: MainPage
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
  },
  { path: 'qr',
    component: QrPage,
    canActivate: [PageGuard] 
  },
  {
    path: 'add',
    component: AddPage,
    canActivate: [PageGuard]  
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

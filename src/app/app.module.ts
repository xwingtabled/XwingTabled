import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { File } from '@ionic-native/file/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { XwingDataService } from './services/xwing-data.service';
import { LayoutService } from './services/layout.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HttpProvider } from './providers/http.provider';
import { HttpAngularProvider } from './providers/http-angular.provider';
import { HttpNativeProvider } from './providers/http-native.provider';
import { HTTP } from '@ionic-native/http/ngx';
import { XwingModule } from './components/xwing.module';
import { PopoverModule } from './popovers/popover.module';
import { ToastController } from '@ionic/angular';
import { ModalModule } from './modals/modal.module';
import { AboutPageModule } from './about/about.module';
import { XwingStateService } from './services/xwing-state.service';
import { XwingImportService } from './services/xwing-import.service';
import { ModalGuard } from './modal-guard';
@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [ 

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    XwingModule,
    ModalModule,
    PopoverModule,
    AboutPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    IonicStorageModule,
    LayoutService,
    XwingDataService,
    XwingStateService,
    XwingImportService,
    HttpProvider,
    HttpAngularProvider,
    HttpNativeProvider,
    HTTP,
    FileTransfer,
    ToastController,
    ModalGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

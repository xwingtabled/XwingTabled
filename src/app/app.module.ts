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
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HttpProvider } from './providers/http.provider';
import { HttpAngularProvider } from './providers/http-angular.provider';
import { HttpNativeProvider } from './providers/http-native.provider';
import { HTTP } from '@ionic-native/http/ngx';
import { XwsModalPage } from './xws-modal/xws-modal.page';
import { LoadingPageModule } from './loading/loading.module';
import { UpgradeModalPage } from './upgrade-modal/upgrade-modal.page';
import { XwingModule } from './components/xwing.module';

@NgModule({
  declarations: [AppComponent, XwsModalPage, UpgradeModalPage],
  entryComponents: [ XwsModalPage, UpgradeModalPage ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    LoadingPageModule,
    XwingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    IonicStorageModule,
    XwingDataService,
    HttpProvider,
    HttpAngularProvider,
    HttpNativeProvider,
    HTTP,
    FileTransfer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

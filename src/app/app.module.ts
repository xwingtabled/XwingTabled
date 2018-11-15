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
import { XwingJsonDataService } from './services/xwing-json-data.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { XwingImageService } from './services/xwing-image.service';
import { HttpProvider } from './providers/http.provider';
import { HttpAngularProvider } from './providers/http-angular.provider';
import { HttpNativeProvider } from './providers/http-native.provider';
import { HTTP } from '@ionic-native/http/ngx';
import { XwsModalPage } from './xws-modal/xws-modal.page';

@NgModule({
  declarations: [AppComponent, XwsModalPage],
  entryComponents: [ XwsModalPage ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    IonicStorageModule,
    XwingJsonDataService,
    XwingImageService,
    HttpProvider,
    HttpAngularProvider,
    HttpNativeProvider,
    HTTP,
    FileTransfer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

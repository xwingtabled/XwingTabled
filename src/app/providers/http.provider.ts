import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';

import {HttpAngularProvider} from './http-angular.provider';
import {HttpNativeProvider} from './http-native.provider';

@Injectable()
export class HttpProvider {
    public http: HttpNativeProvider | HttpAngularProvider;

    constructor(private platform: Platform, private angularHttp: HttpAngularProvider, private nativeHttp: HttpNativeProvider) {
        let isMobile = this.platform.is('cordova'); 
        if (isMobile) {
            console.log("HttpProvider using nativeHttp");
        } else {
            console.log("HttpProvider using angularHttp");
        }
        this.http = isMobile ? this.nativeHttp : this.angularHttp;
    }

    get(url: string, params?: any, options: any = {}) {
        return this.http.get(url, params, options);
    }
}
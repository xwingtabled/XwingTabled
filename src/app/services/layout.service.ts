import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class LayoutService {
    platforms: string[] = [];

    constructor(private platform: Platform) {
        let platforms = [ 'android', 'capacitor', 'cordova', 'desktop', 'ipod', 'iphone', 'ipad',
                            'ios', 'phablet', 'tablet', 'electron', 'mobile', 'pwa', 'hybrid' ];
        this.platforms = platforms.filter(
            (platform) => {
                return  this.platform.is(platform as 
                    "ipad" | "iphone" | "ios" | "android" | 
                    "phablet" | "tablet" | "cordova" | "capacitor" | 
                    "electron" | "pwa" | "mobile" | "desktop" | "hybrid");
            }
        );
        console.log("Platforms", this.platforms);
    }

    getClass() {
        if (this.platforms.indexOf("desktop") >= 0) {
            return "-tablet";
        }
        if (this.platforms.indexOf("tablet") >= 0 && this.platform.isLandscape()) {
            return "-tablet";
        }
        if (this.platforms.indexOf("tablet") >= 0 && this.platform.isPortrait()) {
            return "-tablet-portrait";
        }
        if (this.isPhone() && this.platform.isPortrait()) {
            return "-phone-portrait";
        }
        if (this.isPhone() && this.platform.isLandscape()) {
            return "-phone-landscape";
        }
        // Catch all
        console.log("Layout class can't be determined!", this.platforms);
        return "-tablet";

    }

    isPhone() : boolean {
        let result = !this.platforms.includes("tablet") &&
                     !this.platforms.includes("desktop");
        return result;
    }
}
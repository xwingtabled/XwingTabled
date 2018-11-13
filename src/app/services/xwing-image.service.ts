import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Events } from '@ionic/angular';
import { DownloadService } from './download.service';
import { XwingDataService } from './xwing-data.service';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class XwingImageService extends XwingDataService {
  hotlink: boolean = true;

  constructor(storage: Storage, http: HttpProvider, events: Events, downloader: DownloadService, platform: Platform) {
    super(storage, http, events, downloader);
    // Due to CORS policy, non-mobile platforms will use image hotlinks
    this.hotlink = !(platform.is('ios') || platform.is('android'));
    this.topic = "XwingImageService";
  }

  load_images(manifest: any) {
    if (this.hotlink) {
      this.hotlink_images(manifest);
    } else {
      let keys = [ ]
      this.create_file_list(manifest, ".png").forEach(
        (filename) => {
          keys.push(this.url_to_key_name(filename))
        }
      )
    }
  }

  hotlink_images(manifest: any) {
    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        this.data[this.url_to_key_name(url)] = url;
      }
    )
    this.status("images_complete", "Image data hotlinked");
    console.log("X-Wing Images hotlinked URLS", this.data);
  }

  url_to_key_name(url: string) : string {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return this.mangle_name(name).replace(/.png$/, '');
  }
}

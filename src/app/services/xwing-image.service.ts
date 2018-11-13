import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Events } from '@ionic/angular';
import { XwingDataService } from './xwing-data.service';
import { from, zip } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class XwingImageService extends XwingDataService {
  hotlink: boolean = true;
  image_data: any = { };
  image_urls: any = { };

  constructor(storage: Storage, http: HttpProvider, events: Events, platform: Platform) {
    super(storage, http, events);
    // Due to CORS policy, non-mobile platforms will use image hotlinks
    this.hotlink = !(platform.is('ios') || platform.is('android'));
    this.topic = "XwingImageService";
  }

  load_images(manifest: any) {
    if (this.hotlink) {
      this.hotlink_images(manifest);
    } else {
      this.load_images_from_storage(manifest);
    }
  }

  load_images_from_storage(manifest: any) {
    let keys = [ ];
    let missing = [ ];
    this.create_file_list(manifest, ".png").forEach(
      (filename) => {
        keys.push(this.url_to_key_name(filename));
      }
    );
    this.load_from_storage(keys).subscribe(
      (result) => {
        if (result.value) {
          this.status("image_loaded", "Loaded image " + result.key);
          this.image_data[result.key] = result.value;
          this.image_urls[result.key] = URL.createObjectURL(result.value);
        } else {
          this.status("image_loaded", "Missing image " + result.key);
          missing.push(result.key);
        }

      },
      (error) => {
        console.log("error loading keys", error);
      },
      () => {
        if (missing.length) {
          this.status("images_missing", "Some X-Wing artwork is missing and must be downloaded");
        } else {
          this.status("images_complete", "All X-Wing artwork loaded");
        }
      }
    )
  }

  missing_file_list(manifest: any) : string[ ] {
    let missing_files = [ ];
    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        if (!this.image_urls[this.url_to_key_name(url)]) {
          missing_files.push(url);
        }
      }
    );
    return missing_files;
  }

  hotlink_images(manifest: any) {
    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        this.image_urls[this.url_to_key_name(url)] = url;
      }
    )
    this.status("images_complete", "X-Wing artwork hotlinked");
    console.log("X-Wing Images hotlinked URLS", this.image_urls);
  }

  url_to_key_name(url: string) : string {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return this.mangle_name(name).replace(/.png$/, '');
  }

  download_missing_images(manifest: any) {
    let missing = [ ];
    super.download(this.missing_file_list(manifest)).subscribe(
      (result) => {
        let key = this.url_to_key_name(result.url);
        if (result.response) {
          this.status("image_download", "Downloaded " + key);
          this.store_response(result.url, result.response);
          this.image_data[key] = result.response;
          this.image_urls[key] = URL.createObjectURL(result.response);
        } else {
          this.status("image_download", "Unable to download " + key);
          missing.push(key);
        }
      },
      (error) => {

      },
      () => {
        if (missing.length) {
          this.status("image_download_incomplete", "Unable to download one or more images");
          console.log("unable to download", missing);
        } else {
          this.status("image_download_complete", "X-Wing artwork has been downloaded");
        }
        console.log("X-Wing Image Data", this.image_urls);
      }
    );
  }
}

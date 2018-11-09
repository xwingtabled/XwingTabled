import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { stringify } from '@angular/core/src/util';

@Injectable({
  providedIn: 'root'
})
export class XwingJsonDataService {

  static manifest_url = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/";
  manifest: any = null;
  storage: Storage;
  file: File;
  http: HTTP;
  downloaded: any = [ ];
  queued: any = [ ];


  constructor(file: File, storage: Storage, http: HTTP) { 
    this.file = file;
    this.storage = storage;
    this.http = http;
  }

  check_manifest() {
    this.storage.get('manifest').then(
      (data) => {
        this.manifest = data;
        this.download_manifest();
      },
      (error) => {
        this.download_manifest();
      }
    );
  }

  download_manifest() {
    this.http.get(XwingJsonDataService.manifest_url + "data/manifest.json", {}, {}).then(
      (data) => {
        if (data.status == 200 && data.data) {
          var new_manifest = JSON.parse(data.data);
          if (!this.manifest || this.manifest["version"] != new_manifest["version"]) {
            console.log("Manifest missing or out of date. Downloading data");
            this.storage.set('manifest', new_manifest);
            this.manifest = new_manifest;
            this.download_data();
          }
        }
      },
      (error) => {
        console.log("manifest could not be downloaded");
      }
    );
  }

  create_json_list(manifest: any) {
    let unpack_queue = [ ];
    let download_list = [ ];
    if (manifest) {
      unpack_queue.push(manifest);
      while (unpack_queue.length > 0) {
        let item = unpack_queue.shift();
        if (typeof item == "string") {
          if (item.endsWith(".json")) {
            download_list.push(item);
          }
        } else if (item instanceof Array) {
          item.forEach(
            (element) => {
              unpack_queue.push(element);
            }
          );
        } else {
          Object.entries(item).forEach(
            ([ key, value ]) => {
              unpack_queue.push(value);
            }
          )
        }
      }
    } 
    return download_list;
  }

  download_data() {

  }
}

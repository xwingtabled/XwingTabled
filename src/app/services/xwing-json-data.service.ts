import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Observable, from  } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class XwingJsonDataService {

  static manifest_url = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/";
  manifest: any = null;
  storage: Storage;
  file: File;
  http: HttpClient;
  downloaded: any = [ ];
  queued: any = [ ];
  status: string = "";


  constructor(file: File, storage: Storage, http: HttpClient) { 
    this.file = file;
    this.storage = storage;
    this.http = http;
    this.storage.ready().then(
      () => {
        this.check_manifest();
      }
    );
  }

  check_manifest() {
    this.status = "Loading cached manifest... ";
    this.storage.get('manifest').then(
      (data) => {
        this.status = "Loading cached manifest... found!";
        this.manifest = data;
        this.download_manifest();
      },
      (error) => {
        this.status = "Loading cached manifest... none found";
        this.download_manifest();
      }
    );
  }

  download_manifest() {
    this.status = "Downloading current manifest...";
    this.http.get(XwingJsonDataService.manifest_url + "data/manifest.json").subscribe(
      (data) => {
        if (data instanceof Object) {
          this.status = "Downloading current manifest... received!";
          var new_manifest = data;
          if (!this.manifest || this.manifest["version"] != new_manifest["version"]) {
            this.status = "Current manifest out of date";
            this.storage.set('manifest', new_manifest);
            this.manifest = new_manifest;
            this.download_data();
          }         
        }
      },
      (error) => {
        this.status = "Downloading current manifest... unavailable!";
      }
    );
  }

  static create_file_list(manifest: any, extension: string) {
    // "Flatten" a JSON dictionary, keeping only string values with a file extension
    let unpack_queue = [ ];
    let download_list = [ ];
    if (manifest) {
      // Push the manifest dictionary as the first object
      unpack_queue.push(manifest);

      // While there are still items to unpack
      while (unpack_queue.length > 0) {
        // Dequeue the front item
        let item = unpack_queue.shift();

        // If the item is a string, see if it matches our extension
        if (typeof item == "string") {
          if (item.endsWith(extension)) {
            download_list.push(item);
          }
        } else if (item instanceof Array) {
          // If it's an array, push all values to the back of the unpack queue
          item.forEach(
            (element) => {
              unpack_queue.push(element);
            }
          );
        } else {
          // If it's a dictionary, unpack all key/value pairs and only push the values
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

  download_urls(urls: string[]) {
    return from(urls).pipe(
      concatMap(url => this.http.get(url))
    );
  }

  download_data() {
    let download_queue = XwingJsonDataService.create_file_list(this.manifest, ".json");
    for (var i in download_queue) {
      download_queue[i] = XwingJsonDataService.manifest_url + download_queue[i];
    }
  }
}

import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, defer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { resolve } from 'dns';

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
        console.log("MANIFEST", data);
        /*
        if (data. == 200) {
          this.status = "Downloading current manifest... received!";
          var new_manifest = JSON.parse(data.);
          if (!this.manifest || this.manifest["version"] != new_manifest["version"]) {
            this.status = "Current manifest out of date";
            this.storage.set('manifest', new_manifest);
            this.manifest = new_manifest;
            this.download_data();
          }
        }
        */
      },
      (error) => {
        this.status = "Downloading current manifest... unavailable!";
      }
    );
  }

  static create_file_list(manifest: any, extension: string) {
    let unpack_queue = [ ];
    let download_list = [ ];
    if (manifest) {
      unpack_queue.push(manifest);
      while (unpack_queue.length > 0) {
        let item = unpack_queue.shift();
        if (typeof item == "string") {
          if (item.endsWith(extension)) {
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
    let download_queue = XwingJsonDataService.create_file_list(this.manifest, ".json");
    let source = from(download_queue);
    source.subscribe({
      next(response) { console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log('Completed'); }
     });

  }
}

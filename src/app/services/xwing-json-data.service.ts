import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Observable, from  } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Events } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class XwingJsonDataService {
  static topic: string = "XwingJsonDataService";
  static manifest_url = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/";
  manifest: any = null;
  storage: Storage;
  file: File;
  http: HttpClient;
  events: Events;
  downloaded: any = [ ];
  queued: any = [ ];
  status: string = "";
  download_error: boolean = false;
  
  constructor(file: File, storage: Storage, http: HttpClient, events: Events) { 

    this.file = file;
    this.storage = storage;
    this.http = http;
    this.events = events;
    this.storage.ready().then(
      () => {
        this.events.publish(XwingJsonDataService.topic, 'ready');
      }
    )
  }

  start_downloads() {
    this.check_manifest();
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
    // Returns an observable of HTTP responses from urls
    return from(urls).pipe(
      concatMap(url => this.http.get(url, { observe: 'response'} ))
    );
  }

  download_data() {
    this.downloaded = [ ];
    this.download_error = false;
    this.queued = XwingJsonDataService.create_file_list(this.manifest, ".json");
    for (var i in this.queued) {
      this.queued[i] = XwingJsonDataService.manifest_url + this.queued[i];
    }
    this.download_urls(this.queued).subscribe(
      (response) => {
        if (response.status == 200) {
          this.status = "Saving " + XwingJsonDataService.url_to_key_name(response.url);
          this.store_json_response(response);
        } else {
          this.download_error = true;
        }
      },
      (error) => {
        this.download_error = true;
      },
      () => {
        if (this.download_error) {
          this.status = "Download complete with errors";
        } else {
          this.status = "Download complete!";
        }
      }
    );
  }

  mark_download_complete(url: string) {
    // Move url from queued to downloaded
    this.downloaded.push(url);
    let index = this.queued.indexOf(url);
    if (index !== -1) {
      this.queued.splice(index, 1);
    }
  }

  static mangle_name(name: string) : string {
    return name.replace(/\s/g, '').replace(/\-/g, '').toLowerCase();
  }

  static url_to_key_name(url: string) : string {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return XwingJsonDataService.mangle_name(name).replace(/.json$/, '');
  }

  store_json_response(response: any) {
    this.storage.set(XwingJsonDataService.url_to_key_name(response.url), JSON.parse(response.body));
  }
}

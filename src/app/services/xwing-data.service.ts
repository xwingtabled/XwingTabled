import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Observable, from, onErrorResumeNext, zip } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Events } from '@ionic/angular';
import { DownloadService } from './download.service';

export abstract class XwingDataService {
  topic: string = "XwingDataService";
  storage: Storage;
  events: Events;
  last_message: string = "";
  downloader: DownloadService;
  downloading: boolean = false;
  // Data structure containing filename => json mapping
  data: any = { };
  http: HttpProvider;
  
  constructor(storage: Storage, http: HttpProvider, events: Events, downloader: DownloadService) { 
    this.http = http;
    this.downloader = downloader;
    this.events = events;
    this.storage = storage;
    this.storage.ready().then(
      () => {
        this.status("service_ready", "X-Wing Data Service Ready");
      }
    )
  }

  status(status: string, message: string = "") {
    this.events.publish(this.topic, { 'status' : status, 'message' : message });
    this.last_message = message;
  }


  load_from_storage(keys: string[]) : Promise<{ data: any, missing: string[] }> {
    // Stream keys one at a time
    let keys_obs = from(keys);
    let value_obs = from(keys).pipe(
      concatMap(key => { 
        // Save last key streamed, attempt to get the data
        return this.storage.get(key) 
      })
    );
    let zipped = zip(keys_obs, value_obs, (key: string, value: any) => ({ key, value }));
    let missing = [];
    let data = { }
    return new Promise((resolve, reject) =>{
      zipped.subscribe(
        (item) => {
          if (item.value == null) {
            missing.push(item.key);
          } else {
            data[item.key] = item.value;
          }
        },
        (error) => {
          reject(new Error("storage retrieval error"));
        },
        () => {
          resolve({ data: data, missing: missing });
        }
      )
    });

  }

  create_file_list(manifest: any, extension: string) {
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

  download_data(queue: string[]) {
    this.downloader.download_urls(queue).subscribe(
      (result) => {
        if (result.response) {
          this.status("downloading_data", "Saving " + this.url_to_key_name(result.url));
          this.store_response(result.url, result.response);
        } else {
          console.log("download_data bad response", result.url);
        }
      },
      (error) => {
        console.log("download_data error", error);
      },
      () => {
        this.downloading = false;
        if (this.downloader.error_urls.length > 0) {
          this.status("download_errors", "Download complete with errors");
          console.log("download failed for urls", this.downloader.error_urls);
        } else {
          this.status("download_complete", "Download complete!")
        }
      }
    );
  }

  mangle_name(name: string) : string {
    return name.replace(/\s/g, '').replace(/\-/g, '').toLowerCase();
  }

  abstract url_to_key_name(url: string) : string;

  store_response(url: string, response: any) {
    let key = this.url_to_key_name(url);
    let value = response;
    this.data[key] = value;
    this.storage.set(key, value);
  }
}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Observable, from, onErrorResumeNext, of, zip } from 'rxjs';
import { concatMap, tap, catchError } from 'rxjs/operators';
import { Events } from '@ionic/angular';

export abstract class XwingDataService {
  topic: string = "XwingDataService";
  storage: Storage;
  events: Events;
  last_message: string = "";
  downloading: boolean = false;
  // Data structure containing filename => json mapping
  http: HttpProvider;
  progress: number = 0;
  
  constructor(storage: Storage, http: HttpProvider, events: Events) { 
    this.http = http;
    this.events = events;
    this.storage = storage;
    this.storage.ready().then(
      () => {
        this.status("service_ready", "X-Wing Data Service Ready");
      }
    )
  }

  status(status: string, message: string = "", progress: number = this.progress) {
    this.events.publish(this.topic, { 'status' : status, 'message' : message, 'progress' : progress });
    this.last_message = message;
    console.log(status, message);
  }


  load_from_storage(keys: string[]) : Observable<{ key: string, value: any }> {
    let done: number = 0;
    // Stream keys one at a time
    let keys_obs = from(keys);
    let value_obs = from(keys).pipe(
      concatMap(key => { 
        // Save last key streamed, attempt to get the data
        return this.storage.get(key) 
      })
    );
    let zipped = zip(keys_obs, value_obs, (key: string, value: any) => ({ key, value }));
    return zipped.pipe( 
      tap(
        ((item) => {
          done = done + 1;
          this.progress = (done / keys.length) * 100;
        })
      )
    )
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

  url_to_filename(url: string) {
    let tokens = url.split('/');
    return tokens[tokens.length - 1];
  }

  download(urls: string[], options: any = {}) {
    this.progress =  0;
    this.downloading = true;
    let done: number = 0;
    let url_obs = from(urls);
    let download_obs = from(urls).pipe(
      concatMap(
        url => this.http.get(url, { }, options).pipe(
          catchError(error => { 
            console.log("HTTP get error", error);
            return of(undefined)
          })
        )
      ),
    );
    let zipped = zip(url_obs, download_obs, (url, response) => ({ url, response}));
    return zipped.pipe(
      tap( result => {
        done = done + 1;
        this.progress = (done / urls.length) * 100;
      })
    )
  }

  mangle_name(name: string) : string {
    return name.replace(/\s/g, '').replace(/\-/g, '').toLowerCase();
  }

  abstract url_to_key_name(url: string) : string;

  store_response(url: string, response: any) {
    let key = this.url_to_key_name(url);
    let value = response;
    this.storage.set(key, value);
  }
}

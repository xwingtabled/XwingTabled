import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Observable, from, onErrorResumeNext, of, zip } from 'rxjs';
import { concatMap, tap, catchError } from 'rxjs/operators';
import { Events } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
@Injectable({
  providedIn: 'root'
})
export class XwingDataService {
  topic: string = "XwingDataService";
  last_message: string = "";
  downloading: boolean = false;
  // Data structure containing filename => json mapping
  progress: number = 0;
  initialized: boolean = false;
  transfer: FileTransferObject;

  // Should be hotlinked?
  hotlink: boolean = true;

  // key/filename pairs
  image_map: any = { };

  // base64urls for native, hotlinks for mobile

  image_urls: any = { };
  static manifest_url = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/";

  // Json Data
  data: any = { };


  constructor(private storage: Storage, private http: HttpProvider, private events: Events, 
              private platform: Platform, private file: File, private fileTransfer: FileTransfer,
              private sanitizer: DomSanitizer) { 
    this.hotlink = !(platform.is('ios') || platform.is('android'));
    this.transfer = fileTransfer.create();
    this.storage.ready().then(
      () => {
        this.status("service_ready", "X-Wing Data Service Ready");
        this.check_manifest();
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

  store_response(url: string, response: any) {
    let key = this.url_to_key_name(url);
    let value = response;
    this.storage.set(key, value);
  }

  check_manifest() {
    this.status("manifest_loading", "Loading cached manifest... ");
    this.storage.get('manifest').then(
      (data) => {
        this.status("manifest_loading", "Loading cached manifest... found!");
        this.data = data;
        this.download_manifest();
      },
      (error) => {
        this.status("manifest_loading", "Loading cached manifest... none found");
        this.download_manifest();
      }
    );
  }

  reshape_manifest(manifest: any) {
    let new_manifest = JSON.parse(JSON.stringify(manifest));
    new_manifest.pilots.forEach(
      (faction) => {
        let shipDictionary = { };
        faction.ships.forEach(
          (shipUrl) => {
            shipDictionary[this.url_to_key_name(shipUrl)] = shipUrl;
          }
        )
        faction.ships = shipDictionary;
      }
    )
    let upgradeDictionary = { };
    new_manifest.upgrades.forEach(
      (upgradeUrl) => {
        upgradeDictionary[this.url_to_key_name(upgradeUrl)] = upgradeUrl;
      }
    )
    new_manifest.upgrades = upgradeDictionary;
    return new_manifest;
  }

  download_manifest() {
    this.status("manifest_downloading", "Downloading current manifest...");
    this.http.get(XwingDataService.manifest_url + "data/manifest.json").subscribe(
      (data) => {
        if (data instanceof Object) {
          this.status("manifest_downloading", "Downloading current manifest... received!");
          var new_manifest = data;
          if (!this.data || this.data["version"] != new_manifest["version"]) {
            this.status("manifest_outofdate", "Current manifest out of date");
            this.storage.set('manifest', new_manifest);
            this.data = this.reshape_manifest(new_manifest);
          } else {
            this.status("manifest_current", "Manifest is current.");
            console.log("X-Wing Json Data", this.data);
            this.load_images(this.data);
          }
        }
      },
      (error) => {
        this.status("manifest_error", "Downloading current manifest... unavailable!");
      }
    );
  }

  download_data() {
    let queue = this.create_data_file_list(this.data, ".json");
    for (var i in queue) {
      queue[i] = XwingDataService.manifest_url + queue[i];
    }
    let missing = [ ];
    this.download(queue).subscribe(
      (result) => {
        let key = this.url_to_key_name(result.url);
        if (result.response) {
          this.insert_json_data(result.url.replace(XwingDataService.manifest_url, ''), result.response);
          this.status("data_download_item", "Downloaded data for " + key);
        } else {
          this.status("data_download_item", "Data unavailable for " + key);
          missing.push(key);
        }
      },
      (error) => {
      },
      () => {
        if (missing.length) {
          this.status("data_download_errors", "X-Wing Data download complete with errors");
        } else {
          this.status("data_download_complete", "X-Wing Data download complete!")
        }
        this.storage.set('manifest', this.data);
        console.log("X-Wing Json Data", this.data);
        this.load_images(this.data);
      }
    );
  }

  insert_json_data(filename: string, json: any) {
    let jsonString = JSON.stringify(this.data);
    jsonString = jsonString.replace('"' + filename + '"', JSON.stringify(json));
    this.data = JSON.parse(jsonString);
  }

  create_data_file_list(manifest: any, extension: string) {
    let files = this.create_file_list(manifest, extension);
    let filtered = [ ];
    files.forEach(
      (item) => {
        if (item != "data/ships/ships.json") {
          filtered.push(item);
        }
      }
    )
    return filtered;
  }

  url_to_key_name(url: string) : string {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return this.mangle_name(name).replace(/.json$/, '').replace(/.png$/, '');
  }

  getPilot(faction: string, xwsShip: string, xwsPilot: string) {
    // Given a faction string and pilot object retrieve object data
    // or return null if it can't be retrieved
    let ship = this.getShip(faction, xwsShip);
    let pilot = null;
    ship.pilots.forEach(
      (pilotData) => {
        if (pilotData.xws == xwsPilot) {
          pilot = pilotData;
        }
      }
    );
    return JSON.parse(JSON.stringify(pilot));
  }
  
  getShip(faction: string, xwsShip: string) {
    try {
      let ships = { };
      this.data.pilots.forEach(
        (factionData) => {
          if (factionData.faction == faction) {
            ships = factionData.ships; 
          }
        }
      );
      return JSON.parse(JSON.stringify(ships[xwsShip]));
    } catch (Error) {
      return null;
    }
  }

  getUpgrade(upgradeType: string, xwsUpgrade: string) {
    try {
      let foundUpgrade = null;
      this.data.upgrades[upgradeType].forEach(
        (upgrade) => {
          if (upgrade.xws == xwsUpgrade) {
            foundUpgrade = upgrade;
          }
        }
      )
      return JSON.parse(JSON.stringify(foundUpgrade));
    } catch (Error) {
      return null;
    }
  }
  load_images(manifest: any) {
    if (this.hotlink) {
      this.hotlink_images(manifest);
    } else {
      this.load_images_from_storage(manifest);
    }
  }



  load_images_from_storage(manifest: any) {
    let filenames = [ ];

    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        filenames.push(this.url_to_filename(url));
      }
    );
    this.file.resolveDirectoryUrl(this.file.cacheDirectory).then(
      (value) => {
        this.load_files_from_directory(value, filenames);
      },
      (error) => {
        console.log("can't resolve directory url", error);
      }
    )
  }

  get_image_by_key(key: string) : Promise<string> {
    return new Promise(
      (resolve, reject) => {
        if (this.image_urls[key]) {
          resolve(this.image_urls[key]);
        }  else if (this.image_map[key]) {
          this.file.readAsDataURL(this.file.cacheDirectory, this.image_map[key]).then(
            url => {
              this.image_urls[key] = this.sanitizer.bypassSecurityTrustUrl(url);
              resolve(this.image_urls[key]);
            }
          )
        } else {
          reject("key not found: " + key);
        }
      }
    )
  }

  get_image_by_url(url: string) : Promise<string> {
    return this.get_image_by_key(this.url_to_key_name(url));
  }

  load_files_from_directory(directory: any, filenames: string[]) {
    let filenames_obs = from(filenames);
    let filereader_obs = from(filenames).pipe(
      concatMap(
        filename => from(
          this.file.checkFile(this.file.cacheDirectory, filename)
        )
      ),
      catchError(
        error => {
          return of(undefined)
        }
      )
    );
    let zipped = zip(
      filenames_obs, filereader_obs,
      ((filename, status) => ({ filename, status }))
    );

    let done = 0;
    let missing = [ ];

    zipped.subscribe(
      (item) => {
        done = done + 1;
        this.progress = (done / filenames.length) * 100;
        let key = this.url_to_key_name(item.filename);

        if (item.status) {
          this.image_map[key] = item.filename;
          this.status("image_loaded", "Found image " + item.filename);
        } else {
          this.status("image_loaded", "Missing image " + item.filename);
          missing.push(item.filename);
        }
      },
      (error) => { 
        console.log("image loader error", error);
      },
      () => {
        if (missing.length) {
          this.status("images_missing", "Some X-Wing artwork is missing and must be downloaded");
        } else {
          this.initialized = true;
          this.status("images_complete", "All X-Wing artwork loaded");
        }
        console.log("X-Wing Image Data", this.image_map);
      }
    )
  }

  missing_file_list(manifest: any) : string[ ] {
    let missing_files = [ ];
    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        if (!this.image_map[this.url_to_key_name(url)]) {
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
    this.initialized = true;
    console.log("X-Wing Images hotlinked URLS", this.image_urls);
  }

  download_missing_images(manifest: any) {
    let missing = [ ]
    let urls = this.missing_file_list(manifest);
    let url_obs = from(urls);
    let file_obs = from(urls).pipe(
      concatMap(
        url => this.transfer.download(url, this.file.cacheDirectory + this.url_to_filename(url))
      ),
      catchError(
        error => {
          console.log("download error", error);
          return of(undefined)
        }
      )
    );
    let zipped = zip(url_obs, file_obs, (url, fileEntry) => ({ url, fileEntry}));
    let done = 0;
    zipped.subscribe(
      (result) => {
        let key = this.url_to_key_name(result.url);
        done = done + 1;
        this.progress = (done / urls.length) * 100;
        if (result.fileEntry) {
          this.status("image_download", "Downloaded " + key);
          this.image_map[key] = this.url_to_filename(result.url);
        } else {
          this.status("image_download", "Unaable to download " + key);
          missing.push(key);
        }
      },
      (error) => { },
      () => {
        if (missing.length) {
          this.status("image_download_incomplete", "Unable to download one or more images");
        } else {
          this.status("image_download_complete", "X-Wing artwork has been downloaded");
        }
        this.initialized = true;
        console.log("X-Wing Image Data", this.image_map);
      }
    );
  }
}

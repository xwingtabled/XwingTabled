import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Observable, from, onErrorResumeNext, of, zip } from 'rxjs';
import { concatMap, flatMap, tap, catchError } from 'rxjs/operators';
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
  manifest_url: string = "https://raw.githubusercontent.com/jychuah/XwingTabled/master/scripts/manifest.json";

  // Json Data
  data: any = { };

  constructor(private storage: Storage, private http: HttpProvider, private events: Events, 
              private platform: Platform, private file: File, private fileTransfer: FileTransfer,
              private sanitizer: DomSanitizer) { 
    
    this.hotlink = !platform.is('cordova');
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

  async reset() {
    // Delete all locally stored DB data (not images)
    this.initialized = false;
    this.image_map = { };
    this.image_urls = { };
    this.data = { };
    await this.storage.clear();
    this.check_manifest();
  }

  check_manifest() {
    // Start of data verification/download sequence
    // Loads cached data structure containing all xwing-data2 data.
    // If none is stored, then this.data will be null
    // Followed by download_manifest()
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

  download_manifest() {
    // Download the current manifest from xwing-data2
    this.status("manifest_downloading", "Downloading current manifest...");
    console.log("Downloading from", this.manifest_url)
    this.http.get(this.manifest_url).subscribe(
      (manifest) => {
        if (manifest) {
          this.status("manifest_downloading", "Downloading current manifest... received!");
          let new_manifest = manifest;
          if (!this.data || this.data["version"] != new_manifest["version"]) {
            this.storage.set('manifest', new_manifest);
            this.data = new_manifest;
          }
          // Our manifest is good to go.
          this.status("manifest_current", "Manifest is current.");
          console.log("X-Wing Json Data", this.data);
          this.load_images(this.data);
        }
      },
      (error) => {
        if (this.data) {
          // Even if we weren't able to download a manifest, at least we have some existing data
          this.load_images(this.data);
        } else {
          this.status("no_data_no_connection", "Unable to load or download manifest.json");
        }
      }
    );
  }


  load_from_storage(keys: string[]) : Observable<{ key: string, value: any }> {
    // Helper function to sequentially load keys from storage
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

        try {
          // If the item is a string, see if it matches our extension
          if (typeof item == "string") {
            if (item.endsWith(extension)) {
              download_list.push(item);
            }
          } else if (item instanceof Array) {
            // If it's an array, push all values to the back of the unpack queue
            item.forEach(
              (element) => {
                if (element == undefined) {
                  console.log("Empty array element in ", item);
                } else {
                  unpack_queue.push(element);
                }
              }
            );
          } else {
            // If it's a dictionary, unpack all key/value pairs and only push the values
            Object.entries(item).forEach(
              ([ key, value ]) => {
                if (value == undefined) {
                  console.log("Empty value in ", item);
                } else {
                  unpack_queue.push(value);
                }
              }
            )
          }
        } catch (err) {
          console.log("Error creating file list from manifest", manifest);
          console.log("Could not unpack", item);
        }

      }
    } 
    return download_list;
  }

  url_to_filename(url: string) {
    // Extract the filename from a URL
    let tokens = url.split('/');
    return tokens[tokens.length - 1];
  }

  download(urls: string[], options: any = {}) {
    // Helper function to sequentially download files
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
    // Canonicalizes names: T-65 X-Wing => t65xwing
    return name.replace(/\s/g, '').replace(/\-/g, '').toLowerCase();
  }

  store_response(url: string, response: any) {
    let key = this.url_to_key_name(url);
    let value = response;
    this.storage.set(key, value);
  }

  create_data_file_list(manifest: any, extension: string) {
    // Create a list of data files to download. Skip ships.json since it no longer
    // exists in xwing-data2
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
    return this.mangle_name(name).replace(/.json$/, '').replace(/.png$/, '').replace(/.jpg$/, '');
  }

  getDamageDeck() {
    let deck = [];
    this.data.damagedecks[0].cards.forEach(
      (card) => {
        for (let i = 0; i < card.amount; i++) {
          let initials = "";
          card.title.split(' ').forEach(
            (word) => {
              initials = initials + word[0];
            }
          )
          deck.push({ title: card.title, type: card.type, text: card.text, initials: initials });
        }
      }
    )
    return deck;
  }

  getCondition(xwsCondition: string) {
    let conditionObj = null;
    this.data.conditions.forEach(
      (condition) => {
        if (condition.xws == xwsCondition) {
          conditionObj = JSON.parse(JSON.stringify(condition));
        }
      }
    )
    return conditionObj;
  }

  getPilot(faction: string, xwsShip: string, xwsPilot: string) {
    // Given a faction string and pilot object retrieve object data
    // or return null if it can't be retrieved
    let ship = this.getShip(faction, xwsShip);
    let pilot = null;
    if (xwsPilot == "niennumb-t70xwing") {
      xwsPilot = "niennunb";
    }
    ship.pilots.forEach(
      (pilotData) => {
        if (pilotData.xws == xwsPilot) {
          pilot = pilotData;
        }
      }
    );
    return JSON.parse(JSON.stringify(pilot));
  }

  getXwsFromFFG(id: number) {
    let pilot = null;
    this.data.pilots.forEach(
      (faction) => {
        Object.entries(faction.ships).forEach(
          ([ship_key, ship]) => {
            let shipData = ship['pilots'].find((pilot) => pilot.ffg == id);
            if (shipData) {
              pilot = { id: shipData.xws, name: shipData.xws, ship: ship['xws'] };
            }
          }
        )
      }
    )
    if (pilot) {
      return pilot;
    }
    let upgrade = null;
    Object.entries(this.data.upgrades).forEach(
      ([upgrade_type, upgrade_array]) => {
        let upgradeData = (<Array<any> >upgrade_array).find((upgrade) => upgrade.sides[0].ffg == id);
        if (upgradeData) {
          upgrade = { type: upgrade_type, xws: upgradeData.xws };
        }
      }
    )
    return upgrade;
  }

  getYasbUpgrade(id: number) {
    return JSON.parse(JSON.stringify(this.data.yasb.upgrades[id]));
  }

  getYasbPilot(id: number) {
    return JSON.parse(JSON.stringify(this.data.yasb.pilots[id]));
  }
  
  getShip(faction: string, xwsShip: string) {
    if (xwsShip == "mg100starfortress") {
      xwsShip = "mg100starfortresssf17";
    }
    if (xwsShip == "upsilonclassshuttle") {
      xwsShip = "upsilonclasscommandshuttle";
    }
    if (xwsShip == "tiesilencer") {
      xwsShip = "tievnsilencer";
    }
    try {
      let factionData = this.data.pilots.find((pilotsEntry) => pilotsEntry.faction == faction);
      let ships = factionData.ships;
      let ship = ships[xwsShip];
      // For some reason, xws data in guidokessels data uses different names for 
      // TIE Fighters. For exåmple, tieininterceptor instead of tieinterceptor
      ship.keyname = xwsShip;
      return JSON.parse(JSON.stringify(ship));
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
      // If this is running in a desktop browser, then we can simply
      // hotlink to FFG's image CDN
      this.hotlink_images(manifest);
    } else {
      // Otherwise, begin a local file storage loading sequence.
      this.await_mainpage_loading_notification(manifest);
    }
  }

  await_mainpage_loading_notification(manifest: any) {
    // Wait for the Main Page to verify that the "loading" screen is present
    this.events.subscribe("mainpage", (event) => {
      if (event.message == "loading_controller_present") {
        this.load_images_from_storage(manifest);
      }
    });
    // Notify the Main Page that we will begin loading images. 
    // The above subscription actually begins the loading - but we have
    // to wait for the Main Page to disable screen interactions with
    // LoadingController
    this.status("loading_images", "Loading artwork.");
  }

  load_images_from_storage(manifest: any) {
    // Create a list of image filenames to search for locally
    // from a manifest.
    let filenames = [ ];

    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        filenames.push(this.url_to_filename(url));
      }
    );
    this.create_file_list(manifest, ".jpg").forEach(
      (url) => {
        filenames.push(this.url_to_filename(url));
      }
    )

    // Find the app's cacheDirectory
    this.file.resolveDirectoryUrl(this.file.cacheDirectory).then(
      (value) => {
        // Once found, load image files from the app's cache directory
        this.load_files_from_directory(value, filenames);
      },
      (error) => {
        // Something is seriously wrong - we can't load the app cache directory?
        console.log("can't resolve directory url", error);
      }
    )
  }

  async get_image_by_key(key: string) : Promise<string> {
    // Image loader helper method
    // Given a image keyname, find its associated URL
    if (this.image_urls[key]) {
      // For hotlinked images, this should always be filled
      return this.image_urls[key];
    }
    // If an image_url[key] is empty, that means we must load from disk and cache it for later
    let base64url = await this.file.readAsDataURL(this.file.cacheDirectory, this.image_map[key]);
    this.image_urls[key] = this.sanitizer.bypassSecurityTrustUrl(base64url);
    return this.image_urls[key];
  }

  async get_image_by_url(url: string) : Promise<string> {
    // Get an image via its URL
    return await this.get_image_by_key(this.url_to_key_name(url));
  }

  load_files_from_directory(directory: any, filenames: string[]) {
    // Do a quick file check for a list of images in a directory

    // Create a ({filename, status}) sequence
    let filenames_obs = from(filenames);
    let filereader_obs = from(filenames).pipe(
      flatMap(
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

    // Subscribe to the sequence
    zipped.subscribe(
      (item) => {
        // Mark progress that a file has been checked
        done = done + 1;
        this.progress = (done / filenames.length) * 100;
        let key = this.url_to_key_name(item.filename);

        if (item.status) {
          // If a file is present, record its filename in our image_map
          this.image_map[key] = item.filename;
          //this.status("image_loaded", "Found image " + item.filename);
        } else {
          // If it's missing, mark it as missing
          this.status("image_loaded", "Missing image " + item.filename);
          missing.push(item.filename);
        }
      },
      (error) => { 
        console.log("image loader error", error);
      },
      () => {
        // Notify Main Page that loading images has finished
        this.status("loading_images_complete", "Loading images complete"); 
        if (missing.length) {
          // If there are missing images, notify the Main Page so the user can be prompted to download it
          // This should trigger download_missing_images()
          this.status("images_missing", "Some X-Wing artwork is missing and must be downloaded");
        } else {
          // If there are no missing images, then mark this service as initialized!
          this.initialized = true;
          this.status("images_complete", "All X-Wing artwork loaded");
          console.log("X-Wing Image Data", this.image_map);
        }
      }
    )
  }

  missing_file_list(manifest: any) : string[ ] {
    // Construct a list of missing image files. Missing image
    // files are any .png or .jpg that do not appear in the image_map, which
    // should have been loaded during load_files_from_directory
    let missing_files = [ ];
    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        if (!this.image_map[this.url_to_key_name(url)]) {
          missing_files.push(url);
        }
      }
    );
    this.create_file_list(manifest, ".jpg").forEach(
      (url) => {
        if (!this.image_map[this.url_to_key_name(url)]) {
          missing_files.push(url);
        }
      }
    );
    return missing_files;
  }

  hotlink_images(manifest: any) {
    // Hotlink any images in our image_urls structure directly to FFG.
    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        this.image_urls[this.url_to_key_name(url)] = url;
      }
    )
    this.create_file_list(manifest, ".jpg").forEach(
      (url) => {
        this.image_urls[this.url_to_key_name(url)] = url;
      }
    )
    // Notify Main Page that loading images has finished
    this.status("loading_images_complete", "Loading images complete");
    this.status("images_complete", "X-Wing artwork hotlinked");
    this.initialized = true;
    console.log("X-Wing Images hotlinked URLS", this.image_urls);
  }

  download_missing_images(manifest: any) {
    // Sequentially ownload missing images from FFG image-cdn

    // Create a list of images to download
    let missing = [ ]
    let urls = this.missing_file_list(manifest);

    // Create a sequence of ( { urls, fileEntry })
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

    // Subscribe to the downloads
    zipped.subscribe(
      (result) => {
        let key = this.url_to_key_name(result.url);
        done = done + 1;
        this.progress = (done / urls.length) * 100;
        // Check each download
        if (result.fileEntry) {
          // If a fileEntry is present, mark it as downloaded in our image_map
          this.status("image_download", "Downloaded " + key);
          this.image_map[key] = this.url_to_filename(result.url);
        } else {
          // Otherwise mark it is missing
          this.status("image_download", "Unable to download " + key);
          missing.push(key);
        }
      },
      (error) => { },
      () => {
        if (missing.length) {
          // If there are images that could not be downloaded, inform the Main Page
          this.status("image_download_incomplete", "Unable to download one or more images");
        } else {
          // Otherwise we are good to go. Mark the service as initialized!
          this.status("image_download_complete", "X-Wing artwork has been downloaded");
          this.initialized = true;
          console.log("X-Wing Image Data", this.image_map);
        }
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Observable, from, onErrorResumeNext, of, zip } from 'rxjs';
import { concatMap, mergeMap, flatMap, tap, catchError } from 'rxjs/operators';
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

  // base64urls for native, hotlinks for mobile
  image_urls: any = { };
  manifest_url: string = "https://raw.githubusercontent.com/xwingtabled/XwingTabled/master/scripts/manifest.json";

  unavailable: string[ ] = [ 'https://sb-cdn.fantasyflightgames.com/card_art/Card_art_XW_U_158b.jpg' ];

  // Json Data
  data: any = { };
  ffg_data: any[ ] = [ ];
  stored_filenames: string[] = [ ];

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
    this.image_urls = { };
    this.data = { };
    this.ffg_data = [ ];
    await this.storage.clear();
    this.check_manifest();
  }

  check_manifest() {
    // Start of data verification/download sequence
    // Loads cached data structure containing all xwing-data2 data.
    // If none is stored, then this.data will be null
    // Followed by download_ffg_data()
    this.status("manifest_loading", "Loading cached manifest... ");
    this.storage.get('manifest').then(
      (data) => {
        this.status("manifest_loading", "Loading cached manifest... found!");
        this.data = data;
      },
      (error) => {
        this.status("manifest_loading", "Loading cached manifest... none found");
      }
    ).then(
      (data) => {
        this.status("manifest_loading", "Loading cached FFG Data...");
        return this.storage.get("ffg_data").then(
          (ffg_data) => {
            this.status("manifest_loading", "Loading cached FFG Data... found!");
            this.ffg_data = ffg_data;
          },
          (error) => {
            this.status("manifest_loading", "Loading cached FFG Data... none found");
          }
        )
      }
    ).then(
      (result) => {
        this.download_manifest();
      }
    );
  }

  store_ffg_data(ffg: any) {
    let ffg_data = [ ];
    let maxId = 0;
    ffg.cards.forEach(
      (card) => {
        if (card.id > maxId) {
          maxId = card.id;
        }
      }
    );
    ffg_data = new Array(maxId);
    ffg.cards.forEach(
      (card) => {
        card.name = card.name.replace(/\<\/?[a-z]+\>/gi, '');
        card["metadata"] = this.getMetadataByFFG(card.id);
        if (card.statistics) {
          card.statistics.forEach(
            (statistic) => {
              // Search xws stat metadata.
              let xwsEntry = this.data.stats[0].find((stat) => { return stat.ffg == statistic.statistic_id });
              if (xwsEntry) {
                statistic.xws = xwsEntry.xws;
              } else {
                console.log("Could not find stat", statistic);
              }
            }
          )
        };
        ffg_data[card.id] = card;
      }
    )
    this.ffg_data = ffg_data;
    this.storage.set('ffg_data', this.ffg_data);
  }

  download_ffg_data() {
    this.http.get("https://squadbuilder.fantasyflightgames.com/api/cards").subscribe(
      (ffg) => {
        if (ffg) {
          this.status("ffg_downloading", "Downloading FFG Squadbuilder Data... received!");
          this.store_ffg_data(ffg);
          console.log("FFG Squadbuilder Data", this.ffg_data);
          // Continue to image loading
          this.load_images();
        }
      },
      (error) => {
        if (this.ffg_data) {
          // Even if we weren't able to download a manifest, at least we have some existing data
          this.load_images();
        } else {
          this.status("no_data_no_connection", "Unable to load or download FFG Squadbuilder data");
        }
      }
    )
  }


  download_manifest() {
    // Download the current manifest from xwing-data2
    this.status("manifest_downloading", "Downloading current manifest...");
    this.http.get(this.manifest_url).subscribe(
      (manifest) => {
        if (manifest) {
          this.status("manifest_downloading", "Downloading current manifest... received!");
          let new_manifest = manifest;
          if (!this.data || this.data["version"] != new_manifest["version"] || !this.ffg_data) {
            this.storage.set('manifest', new_manifest);
            this.data = new_manifest;
            // If manifest data is updated, re-download FFG data. Otherwise, skip.
            this.download_ffg_data();
            return;
          }
          // Our manifest is good to go.
          this.status("manifest_current", "Manifest is current.");
          console.log("X-Wing Json Data", this.data);
          // Continue to download squadbuilder data
          this.load_images();
        }
      },
      (error) => {
        if (this.data && this.ffg_data) {
          // Even if we weren't able to download a manifest, at least we have some existing data
          this.status("manifest_download_failed", "Using cached manfiest");
          this.load_images();
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

  create_file_list(manifest: any, extensions: string[]) {
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
            extensions.forEach(
              (extension) => {
                if (item.endsWith(extension)) {
                  download_list.push(item);
                }
              }
            )
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

  mangle_name(name: string) : string {
    // Canonicalizes names: T-65 X-Wing => t65xwing
    return name.replace(/\s/g, '').replace(/\-/g, '').toLowerCase();
  }

  getDamageCardData(title: string) {
    return JSON.parse(JSON.stringify(this.data.damagedecks[0].cards.find((card) => card.title == title)));
  }

  getConditionCardData(xws: string) {
    return JSON.parse(JSON.stringify(this.data.conditions.find((card) => card.xws == xws)));
  }

  getConditionArtwork(xws: string) {
    let condition = this.data.conditions.find((card) => card.xws == xws);
    return this.ffg_data[condition.ffg].image;
  }

  getDamageDeck() {
    let deck = [];
    let cards = { };
    this.data.damagedecks[0].cards.forEach(
      (card) => {
        for (let i = 0; i < card.amount; i++) {
          if (!cards[card.title]) {
            cards[card.title] = [ ];
          }
          cards[card.title].push({ title: card.title, exposed: false });
        }
      }
    )
    while (Object.keys(cards).length > 0) {
      Object.keys(cards).forEach(
        (cardTitle) => {
          if (cards[cardTitle].length > 0) {
            deck.push(cards[cardTitle].pop())
          } else {
            delete cards[cardTitle];
          }
        }
      )
    }

    console.log("Generating damage deck", deck);

    return deck;
  }

  getPilot(faction: string, xwsShip: string, xwsPilot: string) {
    // Given a faction string and pilot object retrieve object data
    // or return null if it can't be retrieved
    let ship = this.getShip(faction, xwsShip);
    let pilot = null;
    if (this.data.shims.xwsPilot[xwsPilot]) {
      xwsPilot = this.data.shims.xwsPilot[xwsPilot];
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
            let pilotData = ship['pilots'].find((pilot) => pilot.ffg == id);
            if (pilotData) {
              pilot = { 
                card_type: 1, 
                faction: faction.faction, 
                xws: pilotData.xws, 
                name: pilotData.xws, 
                ship: ship_key
              };
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
        let upgradeData = (<Array<any> >upgrade_array).find(
          (upgrade) => {
            if (upgrade.sides[0].ffg == id) {
              return true;
            }
            if (upgrade.sides[1] && upgrade.sides[1].ffg == id) {
              return true;
            }
            return false;
          }
        );
        if (upgradeData) {
          upgrade = { card_type: 2, type: upgrade_type, xws: upgradeData.xws };
        }
      }
    )
    return upgrade;
  }

  getPilotPoints(pilot: any) {
    let pilotData = this.getCardByFFG(pilot.ffg);
    let pilotPoints = parseInt(pilotData.cost);
    let initiative = pilotData.initiative;
    let agility = parseInt(pilotData.statistics.find((stat) => stat.xws == 'agility').value);
    pilot.upgrades.forEach(
      (upgrade) => {
        let upgradeData = this.getCardByFFG(upgrade.sides[upgrade.side].ffg);
        if (upgradeData.cost == '*') {
          let statVariable = upgradeData.metadata.cost.variable;
          let cost;
          if (statVariable == 'initiative') {
            cost = upgradeData.metadata.cost.values[initiative];
          } else if (statVariable == 'agility') {
            cost = upgradeData.metadata.cost.values[agility];
          }
          pilotPoints += cost;
        } else {
          pilotPoints += parseInt(upgradeData.cost);
        }
      }
    )

    return pilotPoints;
  }

  isDestroyed(pilot: any) {
    let hull = this.getStatTotal(pilot, "hull");
    let currentHull = hull - pilot.damagecards.length;
    return currentHull <= 0;
  }

  getPointsDestroyed(pilot: any) {

    let pilotPoints = this.getPilotPoints(pilot);
    if (this.isDestroyed(pilot)) {
      return pilotPoints;
    }

    let hull = this.getStatTotal(pilot, "hull");
    let shields = this.getStatTotal(pilot, "shields");
    let totalHitPoints = hull + shields;
    let currentHull = hull - pilot.damagecards.length;
    let currentHitPoints = currentHull;
    if (pilot.shields) {
      currentHitPoints += pilot.shields;
    }
    if (currentHitPoints < totalHitPoints / 2.0) {
      return Math.ceil(pilotPoints / 2.0);
    }
    return 0;
  }

  getYasbUpgrade(id: number) {
    let upgrade = this.data.yasb.upgrades[id];
    if (!upgrade) {
      return null;
    }
    return JSON.parse(JSON.stringify(upgrade));
  }

  getYasbPilot(id: number) {
    let pilot = this.data.yasb.pilots[id];
    if (!pilot) {
      return null;
    }
    return JSON.parse(JSON.stringify(pilot));
  }
  
  getShip(faction: string, xwsShip: string) {
    if (this.data.shims.xwsShip[xwsShip]) {
      xwsShip = this.data.shims.xwsShip[xwsShip];
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
    if (this.data.shims.xwsUpgrade[xwsUpgrade]) {
      xwsUpgrade = this.data.shims.xwsUpgrade[xwsUpgrade];
    }
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

  getMetadataByFFG(id: number) {
    let xwsInfo = this.getXwsFromFFG(id);
    if (!xwsInfo) {
      console.log("Could not find", id);
      return null;
    }
    if (xwsInfo.card_type == 1) {
      let faction = this.data.pilots.find((faction) => faction.faction == xwsInfo.faction);
      let xwsData = faction.ships[xwsInfo.ship].pilots.find((pilot) => pilot.xws == xwsInfo.xws);
      let shipData = JSON.parse(JSON.stringify(faction.ships[xwsInfo.ship]));
      delete shipData.pilots;
      // What metadata will we eventually need for pilots, not provided by FFG data?
      let pilotMeta = { 
        shipIcon: shipData.icon,
        dial: shipData.dial,
        size: shipData.size
      }
      return pilotMeta;
    }
    if (xwsInfo.card_type == 2) {
      let xwsData = this.data.upgrades[xwsInfo.type].find((upgrade) => upgrade.xws == xwsInfo.xws);
      let sideNum = 0;
      let side: any = { };
      for (let i = 0; i < xwsData.sides.length; i++) {
        if (xwsData.sides[i].ffg == id) {
          sideNum = i;
          side = xwsData.sides[i];
        }
      }
      // Set the cost only once for any given card. If it is the second "side", the cost should be 0.
      let upgradeMeta = {
        cost: sideNum == 0 ? xwsData.cost : 0,
      }
      if (side.grants) {
        upgradeMeta["grants"] = side.grants;
      }
      return upgradeMeta;
    }
    return null;
  }

  getCardByFFG(ffg: number) {
    return this.ffg_data[ffg];
  }

  getFFGCardStat(ffg: number, stat: string) {
    let card = this.getCardByFFG(ffg);
    return card.statistics.find((cardstat) => cardstat.xws == stat);
  }

  getCardStatObject(ffg: number, stat: string, remaining: number) {
    let statData = this.getFFGCardStat(ffg, stat);
    if (!statData) {
      return null;
    }
    return {
      type: stat,
      value: statData.value,
      remaining: remaining == -1 ? statData.value : remaining,
      recovers: statData.recurring ? 1 : 0
    }
  } 

  getXwsUpgradeType(ffg: number) {
    return this.data["upgrade-types"].find((upgrade) => upgrade.ffg == ffg).xws;
  }

  getStatTotal(pilotData: any, stat: string) {
    let statTotal = 0;
    let statData = this.getFFGCardStat(pilotData.ffg, stat);
    if (statData) {
      statTotal = parseInt(statData.value);
    }
    pilotData.upgrades.forEach(
      (upgrade) => {
        let statData = this.getFFGCardStat(upgrade.sides[upgrade.side].ffg, stat);
        if (statData) {
          statTotal += parseInt(statData.value);
        }
      }
    );
    return statTotal;
  }

  load_images() {
    console.log("FFG Data", this.ffg_data);
    console.log("xwing-data2 Data", this.data);
    let downloads = { ffg: this.ffg_data, manifest: this.data };
    if (this.hotlink) {
      // If this is running in a desktop browser, then we can simply
      // hotlink to FFG's image CDN
      this.hotlink_images(downloads);
    } else {
      // Otherwise, begin a local file storage loading sequence.
      this.await_mainpage_loading_notification(downloads);
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

    this.create_file_list(manifest, [ ".png", ".jpg" ]).forEach(
      (url) => {
        let filename = this.url_to_filename(url);
        if (!filenames.includes(filename)) {
          filenames.push(filename);
        }
      }
    );

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

  async get_image_by_url(url: string) : Promise<string> {
    // Get an image via its URL

    // If an image_ur
    if (!this.image_urls[url] && this.platform.is('cordova')) {
      let filename = this.url_to_filename(url);
      let base64url = await this.file.readAsDataURL(this.file.cacheDirectory, filename);
      this.image_urls[url] = this.sanitizer.bypassSecurityTrustUrl(base64url);
    }

    return this.image_urls[url];
  }

  load_files_from_directory(directory: any, filenames: string[]) {
    this.stored_filenames = [ ];
    this.unavailable.forEach(
      (unavailable) => {
        let index = filenames.indexOf(this.url_to_filename(unavailable));
        if (index > -1) {
          filenames.splice(index, 1);
        }
      }
    )
    this.file.listDir(this.file.cacheDirectory, '').then(
      (entries) => {
        let hits = 0;
        entries.forEach(
          (fileEntry) => {
            if (filenames.includes(fileEntry.name)) {
              this.stored_filenames.push(fileEntry.name);
              hits += 1;
            }
          }
        )
        this.status("loading_images_complete", "Loading images complete"); 
        if (hits < filenames.length) {
          this.status("images_missing", "Some X-Wing artwork is missing and must be downloaded"); 
        } else {
          this.initialized = true;
          this.status("images_complete", "All X-Wing artwork loaded");
        }
      }
    );
  }

  missing_file_list(manifest: any) : string[ ] {
    // Construct a list of missing image files. Missing image
    // files are any .png or .jpg that do not appear in the image_map, which
    // should have been loaded during load_files_from_directory
    let missing_files = [ ];
    this.create_file_list(manifest,[ ".png", ".jpg" ]).forEach(
      (url) => {
        if (!this.stored_filenames.includes(this.url_to_filename(url))) {
          missing_files.push(url);
        }
      }
    );
    console.log("Missing files", missing_files);
    return missing_files;
  }

  hotlink_images(manifest: any) {
    // Hotlink any images in our image_urls structure directly to FFG.
    this.create_file_list(manifest, [ ".png", ".jpg" ]).forEach(
      (url) => {
        this.image_urls[url] = url;
      }
    )
    // Notify Main Page that loading images has finished
    this.status("loading_images_complete", "Loading images complete");
    this.status("images_complete", "X-Wing artwork hotlinked");
    this.initialized = true;
  }

  download_missing_images() {
    // Sequentially ownload missing images from FFG image-cdn
    let downloads = { ffg: this.ffg_data, manifest: this.data };
    // Create a list of images to download
    let urls = this.missing_file_list(downloads);

    this.unavailable.forEach(
      (unavailable) => {
        let index = urls.indexOf(this.url_to_filename(unavailable));
        if (index > -1) {
          urls.splice(index, 1);
        }
      }
    )

    // Create a sequence of ( { urls, fileEntry })
    //let url_obs = from(urls);
    let file_obs = from(urls).pipe(
      concatMap(
        url => from(this.http.downloadFile(url, this.file.cacheDirectory + this.url_to_filename(url))).pipe(
          catchError(error => of(undefined))
        )
      )
    );
    //let zipped = zip(url_obs, file_obs, (url, fileEntry) => ({ url, fileEntry}));
    let done = 0;
    let missing = 0;

    // Subscribe to the downloads
    file_obs.subscribe(
      (fileEntry) => {
        done = done + 1;
        this.progress = (done / urls.length) * 100;
        // Check each download
        if (fileEntry) {
          let filename = this.url_to_filename(fileEntry.name);
          // If a fileEntry is present, mark it as downloaded in our image_map
          this.status("image_download", "Downloaded " + filename);
          this.stored_filenames.push(filename);
        } else {
          // Otherwise mark it is missing
          missing += 1;
          this.status("image_download", "Unable to download a file");
        }
      },
      (error) => { },
      () => {
        if (missing > 0) {
          // If there are images that could not be downloaded, inform the Main Page
          this.status("image_download_incomplete", "Unable to download one or more images");
        } else {
          // Otherwise we are good to go. Mark the service as initialized!
          this.status("image_download_complete", "X-Wing artwork has been downloaded");
          this.initialized = true;
        }
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Events } from '@ionic/angular';
import { XwingDataService } from './xwing-data.service';
@Injectable({
  providedIn: 'root'
})
export class XwingJsonDataService extends XwingDataService {
  static manifest_url = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/";
  data: any = { };
  
  constructor(storage: Storage, http: HttpProvider, events: Events) { 
    super(storage, http, events);
    this.topic = "XwingJsonDataService";
    this.storage.ready().then(
      () => {
        this.status("service_ready", "X-Wing Data Service Ready");
        this.check_manifest();
      }
    )
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


  download_manifest() {
    this.status("manifest_downloading", "Downloading current manifest...");
    this.http.get(XwingJsonDataService.manifest_url + "data/manifest.json").subscribe(
      (data) => {
        if (data instanceof Object) {
          this.status("manifest_downloading", "Downloading current manifest... received!");
          var new_manifest = data;
          if (!this.data || this.data["version"] != new_manifest["version"]) {
            this.status("manifest_outofdate", "Current manifest out of date");
            this.storage.set('manifest', new_manifest);
            this.data = new_manifest;
            this.initialized = true;
          } else {
            this.status("manifest_current", "Manifest is current.");
            console.log("X-Wing Json Data", this.data);
          }
        }
      },
      (error) => {
        this.status("manifest_error", "Downloading current manifest... unavailable!");
      }
    );
  }

  download_data() {
    let queue = this.create_file_list(this.data, ".json");
    for (var i in queue) {
      queue[i] = XwingJsonDataService.manifest_url + queue[i];
    }
    let missing = [ ];
    super.download(queue).subscribe(
      (result) => {
        let key = this.url_to_key_name(result.url);
        if (result.response) {
          this.insert_json_data(result.url.replace(XwingJsonDataService.manifest_url, ''), result.response);
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
        this.initialized = true;
      }
    );
  }

  insert_json_data(filename: string, json: any) {
    let jsonString = JSON.stringify(this.data);
    jsonString = jsonString.replace('"' + filename + '"', JSON.stringify(json));
    this.data = JSON.parse(jsonString);
  }

  create_file_list(manifest: any, extension: string) {
    let files = super.create_file_list(manifest, extension);
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
    return this.mangle_name(name).replace(/.json$/, '');
  }

  getPilotData(faction: string, xwsShip: string, xwsPilot: string) {
    // Given a faction string and pilot object retrieve object data
    // or return null if it can't be retrieved
    let ship = this.getShipData(faction, xwsShip);
    let pilot = null;
    ship.pilots.forEach(
      (pilotData) => {
        if (pilotData.xws == xwsPilot) {
          pilot = pilotData;
        }
      }
    );
    return pilot;
  }
  
  getShipData(faction: string, xwsShip: string) {
    try {
      let ships = [ ];
      this.data.pilots.forEach(
        (factionData) => {
          if (factionData.faction == faction) {
            ships = factionData.ships; 
          }
        }
      );
      let ship = null;
      ships.forEach(
        (shipData) => {
          if (shipData.xws == xwsShip) {
            ship = shipData;
          }
        }
      );
      return ship;
    } catch (Error) {
      return null;
    }
  }

}

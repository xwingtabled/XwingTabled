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
  manifest: any = null;
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
        this.manifest = data;
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
          if (!this.manifest || this.manifest["version"] != new_manifest["version"]) {
            this.status("manifest_outofdate", "Current manifest out of date");
            this.storage.set('manifest', new_manifest);
            this.manifest = new_manifest;
          } else {
            this.status("manifest_current", "Manifest is current.");
          }
          this.load_data();
        }
      },
      (error) => {
        this.status("manifest_error", "Downloading current manifest... unavailable!");
      }
    );
  }

  load_data() {
    // See if any json files are missing from storage
    let keys = [];
    this.create_file_list(this.manifest, ".json").forEach(
      (filename) => {
        // This filename exists in the manifest but no data exists
        if (filename != "data/ships/ships.json") {
          keys.push(this.url_to_key_name(filename))
        }
      }
    );
    let missing = [ ];
    super.load_from_storage(keys).subscribe(
      (result) => {
        if (result.value) {
          this.status("data_loaded", "Loaded data " + result.key);
          this.data[result.key] = result.value;
        } else {
          this.status("data_loaded", "Missing data " + result.key);
          missing.push(result.key);
        }
      },
      (error) => { },
      () => {
        if (missing.length) {
          this.status("data_missing", "Some X-Wing data is missing and needs to be downloaded");
        } else {
          this.status("data_complete", "X-Wing data loaded");
        }
        console.log("X-Wing Json Data", this.data);
      }
    );
  }

  download_data() {
    let queue = this.create_file_list(this.manifest, ".json");
    for (var i in queue) {
      queue[i] = XwingJsonDataService.manifest_url + queue[i];
    }
    let missing = [ ];
    super.download(queue).subscribe(
      (result) => {
        if (result.response) {
          this.data[this.url_to_key_name(result.url)] = result.response;
          this.store_response(result.url, result.response);
        } else {
          missing.push(this.url_to_key_name(result.url));
        }
      },
      (error) => {
      },
      () => {
        if (missing.length) {
          this.status("data_download_errors", "X-Wing Data download complete with errors");
          console.log("download failed for urls", missing);
        } else {
          this.status("data_download_complete", "X-Wing Data download complete!")
        }
      }
    );
  }

  url_to_key_name(url: string) : string {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return this.mangle_name(name).replace(/.json$/, '');
  }

}

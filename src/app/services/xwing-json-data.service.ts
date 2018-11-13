import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Observable, from, onErrorResumeNext } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Events } from '@ionic/angular';
import { DownloadService } from './download.service';
import { XwingDataService } from './xwing-data.service';
@Injectable({
  providedIn: 'root'
})
export class XwingJsonDataService extends XwingDataService {
  static manifest_url = "https://raw.githubusercontent.com/guidokessels/xwing-data2/master/";
  manifest: any = null;
  
  constructor(storage: Storage, http: HttpProvider, events: Events, downloader: DownloadService) { 
    super(storage, http, events, downloader);
    this.topic = "XwingJsonDataService";
    this.http = http;
    this.downloader = downloader;
    this.events = events;
    this.storage = storage;
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
            this.load_from_storage();
          }
        }
      },
      (error) => {
        this.status("manifest_error", "Downloading current manifest... unavailable!");
      }
    );
  }

  load_from_storage() {
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
  }

  download_data() {
    this.downloading = true;
    let queue = this.create_file_list(this.manifest, ".json");
    for (var i in queue) {
      queue[i] = XwingJsonDataService.manifest_url + queue[i];
    }
    super.download_data(queue);
  }

  url_to_key_name(url: string) : string {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return this.mangle_name(name).replace(/.json$/, '');
  }

}

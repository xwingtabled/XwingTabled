import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../providers/http.provider';
import { Events } from '@ionic/angular';
import { XwingDataService } from './xwing-data.service';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Observable, from, onErrorResumeNext, of, zip } from 'rxjs';
import { concatMap, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class XwingImageService extends XwingDataService {
  hotlink: boolean = true;
  image_data: any = { };
  image_urls: any = { };
  file: File;
  transfer: FileTransferObject;

  constructor(storage: Storage, http: HttpProvider, events: Events, platform: Platform, file: File, fileTransfer: FileTransfer) {
    super(storage, http, events);
    this.file = file;
    this.transfer = fileTransfer.create();
    // Due to CORS policy, non-mobile platforms will use image hotlinks
    this.hotlink = !(platform.is('ios') || platform.is('android'));
    this.topic = "XwingImageService";
  }

  load_images(manifest: any) {
    if (this.hotlink) {
      this.hotlink_images(manifest);
    } else {
      this.load_images_from_storage(manifest);
    }
  }

  url_to_filename(url: string) {
    let tokens = url.split('/');
    return tokens[tokens.length - 1];
  }

  strip_url_file(url: string) {
    let protocol = "file://"
    if (url.indexOf(protocol) == 0) {
      url = url.substring(protocol.length);
    }
    return url;
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

  load_files_from_directory(directory: any, filenames: string[]) {
    let filenames_obs = from(filenames);
    let filereader_obs = from(filenames).pipe(
      concatMap(
        filename => from(
          this.file.getFile(directory, filename, {})
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
      ((filename, fileEntry) => ({ filename, fileEntry }))
    );

    let done = 0;
    let missing = [ ];

    zipped.subscribe(
      (item) => {
        done = done + 1;
        this.progress = (done / filenames.length) * 100;
        let key = this.url_to_key_name(item.filename);
        if (item.fileEntry) {
          this.status("image_loaded", "Loaded image " + item.filename);
          this.image_urls[key] = this.strip_url_file(item.fileEntry.toURL());
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
          this.status("images_complete", "All X-Wing artwork loaded");
        }
        console.log("X-Wing Image Data", this.image_urls);
      }
    )

    /*
    this.load_from_storage(keys).subscribe(
      (result) => {
        if (result.value) {
          this.status("image_loaded", "Loaded image " + result.key);
          this.image_data[result.key] = result.value;
          this.image_urls[result.key] = URL.createObjectURL(result.value);
        } else {
          this.status("image_loaded", "Missing image " + result.key);
          missing.push(result.key);
        }

      },
      (error) => {
        console.log("error loading keys", error);
      },
      () => {
        if (missing.length) {
          this.status("images_missing", "Some X-Wing artwork is missing and must be downloaded");
        } else {
          this.status("images_complete", "All X-Wing artwork loaded");
        }
      }
    )*/
  }

  missing_file_list(manifest: any) : string[ ] {
    let missing_files = [ ];
    this.create_file_list(manifest, ".png").forEach(
      (url) => {
        if (!this.image_urls[this.url_to_key_name(url)]) {
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
    console.log("X-Wing Images hotlinked URLS", this.image_urls);
  }

  url_to_key_name(url: string) : string {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return this.mangle_name(name).replace(/.png$/, '');
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
          this.image_urls[key] = this.strip_url_file(result.fileEntry.toURL());
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
        console.log("X-Wing Image Data", this.image_urls);
      }
    );
    /*
    super.download(queue, { responseType: 'blob'} ).subscribe(
      (result) => {
        let key = this.url_to_key_name(result.url);
        if (result.response) {
          this.status("image_download", "Downloaded " + key);
          this.store_response(result.url, result.response);
          this.image_data[key] = result.response;
          this.image_urls[key] = URL.createObjectURL(result.response);
        } else {
          this.status("image_download", "Unable to download " + key);
          missing.push(key);
        }
      },
      (error) => {

      },
      () => {
        if (missing.length) {
          this.status("image_download_incomplete", "Unable to download one or more images");
          console.log("unable to download", missing);
        } else {
          this.status("image_download_complete", "X-Wing artwork has been downloaded");
        }
        console.log("X-Wing Image Data", this.image_urls);
      }
    );
    */
  }
}

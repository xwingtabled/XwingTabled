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
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class XwingImageService extends XwingDataService {
  hotlink: boolean = true;
  image_map: any = { };
  image_urls: any = { };
  file: File;
  transfer: FileTransferObject;
  sanitizer: DomSanitizer;

  constructor(storage: Storage, http: HttpProvider, events: Events, 
              platform: Platform, file: File, fileTransfer: FileTransfer,
              sanitizer: DomSanitizer) {
    super(storage, http, events);
    this.sanitizer = sanitizer;
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

  get_image_url(key: string) : Promise<string> {
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
          reject("key not found");
        }
      }
    )
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
    console.log("X-Wing Images hotlinked URLS", this.image_urls);
  }

  url_to_key_name(url: string) : string {
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
        console.log("X-Wing Image Data", this.image_map);
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpProvider } from '../providers/http.provider';
import { Events } from '@ionic/angular';
import { from, of, zip } from 'rxjs';
import { concatMap, catchError, filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  events: Events;
  downloaded: any = [ ];
  error_urls: any = [ ];
  queued: any = [ ];
  downloading: boolean = false;
  progress: number = 100;
  http: HttpProvider;

  constructor(http: HttpProvider, events: Events) {
    this.http = http;
    this.events = events;
  }

  download_urls(urls: string[], options: any = { responseType: 'json' }) {
    this.queued = urls;
    this.downloaded = [ ];
    this.error_urls = [ ];

    let url_obs = from(urls);
    let download_obs = from(urls).pipe(
      concatMap(
        url => this.http.get(url, options).pipe(
          catchError(error => of(undefined))
        )
      )
    );
    return zip(url_obs, download_obs, (url: string, response: any) => ({ url, response })).pipe(
      tap((item) => {
        if (item.response == undefined || item.response == null) {
          this.mark_download_error(item.url);
        } else {
          this.mark_download_complete(item.url);
        }
      })
    );
  }

  update_download_progress() {
    let total = this.downloaded.length + this.queued.length + this.error_urls.length;
    if (total == 0) {
      this.progress = 0;
      return;
    }
    this.progress = ((this.downloaded.length + this.error_urls.length) / total) * 100;
  }

  remove_queued(url: string) {
    let index = this.queued.indexOf(url);
    if (index !== -1) {
      this.queued.splice(index, 1);
    }
  }

  mark_download_complete(url: string) {
    // Move url from queued to downloaded
    this.downloaded.push(url);
    this.remove_queued(url);
    this.update_download_progress();
  }

  mark_download_error(url: string) {
    // Move url from queued to error
    this.error_urls.push(url);
    this.remove_queued(url);
    this.update_download_progress();
  }
}

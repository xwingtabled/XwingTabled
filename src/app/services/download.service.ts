import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Events } from '@ionic/angular';
import { from, of } from 'rxjs';
import { concatMap, catchError, filter, map } from 'rxjs/operators';

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
  http: HttpClient;

  constructor(http: HttpClient, events: Events) {
    this.http = http;
    this.events = events;
  }

  download_urls(urls: string[]) {
    this.queued = urls;
    this.downloaded = [ ];
    this.error_urls = [ ];
    // Returns an observable of HTTP responses from urls
    return from(urls).pipe(
      concatMap(
        url => this.http.get(url, { observe: 'response'} ).pipe(
          catchError((error) => { 
            this.mark_download_error(error.url);
            return of(undefined); 
          })
        ) 
      ),
      filter((response) => response != undefined),
      map((response) => { 
        this.mark_download_complete(response.url);
        return response; 
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

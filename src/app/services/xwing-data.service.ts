import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Events } from '@ionic/angular';
import { Observable, from, onErrorResumeNext } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class XwingDataService {
  events: Events;
  downloaded: any = [ ];
  queued: any = [ ];
  downloading: boolean = false;
  download_error: boolean = false;
  download_progress: number = 100;
  last_message: string = "";
  http: HttpClient;

  constructor(http: HttpClient, events: Events) {
    this.http = http;
    this.events = events;
  }

  download_urls(urls: string[]) {
    // Returns an observable of HTTP responses from urls
    return from(urls).pipe(
      concatMap(url => onErrorResumeNext(this.http.get(url, { observe: 'response'} )))
    );
  }

  update_download_progress() {
    let total = this.downloaded.length + this.queued.length;
    if (total == 0) {
      this.download_progress = 0;
      return;
    }
    this.download_progress = (this.downloaded.length / total) * 100;
  }


  mark_download_complete(url: string) {
    // Move url from queued to downloaded
    this.downloaded.push(url);
    let index = this.queued.indexOf(url);
    if (index !== -1) {
      this.queued.splice(index, 1);
    }
  }
}

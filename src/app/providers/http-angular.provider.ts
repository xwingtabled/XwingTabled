import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpAngularProvider {
    constructor(public http: HttpClient) {}

    public get(url: string, params?: any, options: any = {}) {
        options.params = params;
        //options.withCredentials = true;

        return this.http.get(url, options);
    }
}
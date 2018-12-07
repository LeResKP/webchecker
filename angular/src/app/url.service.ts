import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';

import { API_URL } from './urls';


@Injectable({
  providedIn: 'root'
})
export class UrlService {

  urls =  null;
  obs = null;

  constructor(private http: HttpClient) { }

  getUrls(): Observable<Array<any>> {
    if (this.urls !== null) {
      return of(this.urls);
    } else if (this.obs === null) {
      this.obs = this.http.get(`${API_URL}/urls`).pipe(
        tap(urls => {
          this.urls = urls;
          return urls;
        }),
        shareReplay(1)
      );
    }
    return this.obs;
  }

  getUrl(id) {
    return this.getUrls().pipe(
      map((urls) => urls.filter(url => url.url_id === id)),
      map((urls) => urls.length ? urls[0] : null),
    );
  }

  createStatus(urlId, device, status) {
    return this.http.post(`${API_URL}/urls/${urlId}/status`, {status, device: device.id}).pipe(
      tap((res) => {
        // NOTE: it works because this.urls is loaded.
        this.getUrl(urlId).subscribe(r => r['status'] = res['status']);
      })
    );
  }

  updateStatus(urlId, statusId, status) {
    return this.http.put(`${API_URL}/status/${statusId}`, {status}).pipe(
      tap((res) => {
        // NOTE: it works because this.urls is loaded.
        this.getUrl(urlId).subscribe(r => r['status'] = res['status']);
      })
    );
  }

  doScreenshot(urlId) {
    return this.http.post(`${API_URL}/screenshots/${urlId}`, {}).pipe(
      tap((res) => {
        // NOTE: it works because this.urls is loaded.
        this.getUrl(urlId).subscribe(r => {
          r['blobs'] = res['blobs'];
          r['status'] = res['status'];
        });
      })
    );
  }
}

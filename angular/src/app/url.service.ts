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

  getUrls(versionId): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${API_URL}/v/${versionId}/urls`);
  }

  getUrl(urlId) {
    return this.http.get<Array<any>>(`${API_URL}/urls/${urlId}`);
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
          r['screenshots'] = res['screenshots'];
          r['status'] = res['status'];
        });
      })
    );
  }

  getValidation(urlId) {
    return this.http.get(`${API_URL}/urls/${urlId}/validation`);
  }
}

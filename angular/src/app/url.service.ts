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

  getDiffUrls(aVersionId, bVersionId): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${API_URL}/v/${aVersionId}/d/${bVersionId}/urls`);
  }

  getUrl(urlId) {
    return this.http.get<Array<any>>(`${API_URL}/urls/${urlId}`);
  }

  createStatus(url, device, status) {
    return this.http.post(`${API_URL}/urls/${url.url_id}/status`, {status, device: device.id}).pipe(
      tap((res) => {
        url['status'] = res['status'];
      })
    );
  }

  updateStatus(url, statusId, status) {
    return this.http.put(`${API_URL}/status/${statusId}`, {status}).pipe(
      tap((res) => {
        url['status'] = res['status'];
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

  getValidations(versionId): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${API_URL}/v/${versionId}/validations`);
  }

  getValidation(urlId) {
    return this.http.get(`${API_URL}/validations/${urlId}`);
  }

  getDiff(screenshotId, aVersionId) {
    return this.http.get(`${API_URL}/diff/${aVersionId}/screenshots/${screenshotId}`);
  }
}

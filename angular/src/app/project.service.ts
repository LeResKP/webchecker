import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { flatMap, filter, first, shareReplay } from 'rxjs/operators';

import { API_URL } from './urls';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  currentProject: any;
  private _projects$: Observable<Array<any>>;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  get projects$() {
    if (!this._projects$) {
      this._projects$ = this.http.get<any>(`${API_URL}/projects`).pipe(shareReplay(1));
    }
    return this._projects$;
  };

  getProject$(id) {
    return this.projects$.pipe(
      flatMap(r => r),
      filter((p) => p.id === id),
      first()
    );
  }

  setCurrentProject(id) {
    this.getProject$(id).subscribe(p => this.currentProject = p);
  }
}

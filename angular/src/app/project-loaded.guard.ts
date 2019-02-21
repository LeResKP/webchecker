import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProjectService } from './project.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectLoadedGuard implements CanActivate {

  constructor(private projectService: ProjectService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // We want the project loaded
    return this.projectService.projects$.pipe(map(() => true));
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectGuard implements CanActivate {

  constructor(private router: Router, private projectService: ProjectService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      console.log('check guard');

    this.projectService.projects$.pipe(first()).subscribe(res => {
      const projectId = res[0].id;
      const versionId = res[0].current_version.id;
      // TODO: display an error if no project defined or no version
      this.router.navigate([`/p/${projectId}/v/${versionId}`]);
    });
    return false;
  }
}

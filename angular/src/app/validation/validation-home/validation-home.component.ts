import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { ProjectService } from '../../project.service';
import { UrlService } from '../../url.service';


@Component({
  selector: 'app-validation-home',
  templateUrl: './validation-home.component.html',
  styles: []
})
export class ValidationHomeComponent implements OnDestroy, OnInit {
  filterModel = null;

  routeSub: Subscription;
  urls = <any>[];

  constructor(private projectService: ProjectService, private urlService: UrlService) { }

  ngOnInit() {
      this.routeSub = this.projectService.currentVersion$.subscribe(() => {
        this.urlService.getValidationUrls(this.projectService.currentVersion.id).subscribe((urls) => {
          this.urls = urls;
        });
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  filterFunction(url) {
    return this.filterModel !== null ? url.valid === this.filterModel : true;
  }

  filterFunctionBound = (x) => this.filterFunction(x);

  getIcons(url) {
    const icons = [];
    if (url.w3c_valid === true) {
      icons.push('check');
    } else {
      icons.push('times');
    }

    if (url.linkchecker_valid === true) {
      icons.push('check');
    } else {
      icons.push('times');
    }

    return icons;
  }

}

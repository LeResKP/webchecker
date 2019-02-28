import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ProjectService } from '../../project.service';
import { UrlService } from '../../url.service';

import { STATUS } from '../../constants';


@Component({
  selector: 'app-screenshot-home',
  templateUrl: './screenshot-home.component.html',
  styles: []
})
export class ScreenshotHomeComponent implements OnDestroy, OnInit {
  STATUS = STATUS;
  filterModel = null;

  routeSub: Subscription;
  urls = <any>[];

  constructor(private projectService: ProjectService, private urlService: UrlService) { }

  ngOnInit() {
      this.routeSub = this.projectService.currentVersion$.subscribe(() => {
        this.urlService.getUrls(this.projectService.currentVersion.id).subscribe((urls) => {
          this.urls = urls;
        });
      });
  }

  filterFunction(url) {
    return this.filterModel ? url.status.status === this.filterModel : true;
  }


  filterFunctionBound = (x) => this.filterFunction(x);

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}

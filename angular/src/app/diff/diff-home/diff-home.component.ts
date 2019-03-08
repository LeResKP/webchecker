import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { ProjectService } from '../../project.service';
import { UrlService } from '../../url.service';


@Component({
  selector: 'app-diff-home',
  templateUrl: './diff-home.component.html',
  styles: []
})
export class DiffHomeComponent implements OnDestroy, OnInit {
  filterModel = null;
  routeSub: Subscription;
  urls = <any>[];

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private urlService: UrlService) { }

  ngOnInit() {
    this.projectService.setDiffVersion(+this.route.snapshot.params['b_id']);

    this.routeSub = combineLatest(
      this.route.paramMap,
      this.projectService.currentVersion$,
      (params: Params, version: any) => ({'b_version_id': +params.params['b_id'], 'a_version_id': version.id})
    ).subscribe((data) => {
      this.urlService.getDiffUrls(data.a_version_id, data.b_version_id).subscribe((urls) => {
        this.urls = urls;
      });
    });
  }

  ngOnDestroy() {
    this.projectService.diffVersion = null;
    this.routeSub.unsubscribe();
  }

  filterFunction(url) {
    return this.filterModel !== null ? url.has_diff === this.filterModel : true;
  }

  filterFunctionBound = (x) => this.filterFunction(x);

  getIcons(url) {
    const icons = [];
    if (url.has_diff === true) {
      icons.push('times');
    } else {
      icons.push('check');
    }
    return icons;
  }

}

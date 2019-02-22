import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { API_URL } from '../urls';
import { ProjectService } from '../project.service';
import { UrlService } from '../url.service';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnDestroy, OnInit {

  public diff: any;
  public showLayer = true;
  public api_url = API_URL;
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private urlService: UrlService) { }

  ngOnInit() {

    this.routeSub = combineLatest(
      this.route.paramMap,
      this.projectService.currentVersion$,
      (params: Params, version: any) => ({'screenshot_id': +params.params['id'], 'a_version_id': version.id})
    ).subscribe((data) => {
      this.urlService.getDiff(data['screenshot_id'], data['a_version_id']).subscribe((res) => {
        this.diff = res;
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}

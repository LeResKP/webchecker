import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { ProjectService } from '../../project.service';
import { UrlService } from '../../url.service';


@Component({
  selector: 'app-validation-home',
  templateUrl: '../../action-home.component.html',
  styles: []
})
export class ValidationHomeComponent implements OnDestroy, OnInit {

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

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}

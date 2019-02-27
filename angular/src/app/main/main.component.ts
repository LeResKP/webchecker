import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { Subscription, combineLatest, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { filter, flatMap, map, switchMap } from 'rxjs/operators';
import { of, pipe, from } from 'rxjs';



import { ProjectService } from '../project.service';
import { UrlService } from '../url.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnDestroy, OnInit {

  urls = <any>[];

  projects: any;
  routeSub: Subscription;

  public currentAction: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private urlService: UrlService) {}


  setCurrentAction() {
    this.currentAction = this.route.snapshot.data.defaultAction;
    if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.firstChild) {
      this.currentAction = this.route.snapshot.firstChild.firstChild.routeConfig.path;
    }
  }

  ngOnInit() {

    this.setCurrentAction();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => this.setCurrentAction());


    if (this.currentAction === 'diff') {
      this.routeSub = combineLatest(
        this.route.paramMap,
        this.projectService.currentVersion$,
        (params: Params, version: any) => ({'b_version_id': +params.params['b_id'], 'a_version_id': version.id})
      ).subscribe((data) => {
        this.urlService.getDiffUrls(data.a_version_id, data.b_version_id).subscribe((urls) => {
          this.urls = urls;
        });
      });
    } else {
      this.routeSub = this.projectService.currentVersion$.subscribe(() => {
        this.urlService.getUrls(this.projectService.currentVersion.id).subscribe((urls) => {
          this.urls = urls;
        });
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}

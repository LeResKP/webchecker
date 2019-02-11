import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { filter, map } from 'rxjs/operators';
import { of, pipe, from } from 'rxjs';


import { STATUS } from '../constants';

import { ProjectService } from '../project.service';
import { UrlService } from '../url.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnDestroy, OnInit {

  urls = <any>[];
  _urls = <any>[];
  STATUS = STATUS;

  projects: any;
  routeSub: Subscription;

  filterModel = null;
  keyupSub:  Subscription;
  @ViewChild('input') inputElRef: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private urlService: UrlService) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params: Params) => {
      this.projectService.setCurrentProject(+params.params.projectId);

      this.urlService.getUrls(+params.params.versionId).subscribe((urls) => {
        this._urls = urls;
        this.setUrls();
      });
    });

    this.keyupSub = fromEvent(this.inputElRef.nativeElement, 'keyup').pipe(
      debounceTime(100),
      distinctUntilChanged(),
    ).subscribe((event: KeyboardEvent) => {
      this.urls = this._urls.filter(v => v.url.indexOf((<HTMLInputElement>event.target).value) > -1);
      this.setUrls();
    });
  }


  setUrls() {
    this.urls = this._urls
      .filter(v => this.filterModel ? v.status.status === this.filterModel : true)
      .filter(v => this.inputElRef.nativeElement.value ? v.url.indexOf(this.inputElRef.nativeElement.value) > -1 : true);
  }

  onChange() {
    this.setUrls();
  }

  ngOnDestroy() {
    this.keyupSub.unsubscribe();
  }

}

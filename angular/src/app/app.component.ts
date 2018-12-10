import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import {fromEvent, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';


import { STATUS } from './constants';
import { UrlService } from './url.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'webchecker';
  urls = <any>[];
  _urls = <any>[];
  STATUS = STATUS;

  filterModel = null;
  keyupSub:  Subscription;
  @ViewChild('input') inputElRef: ElementRef;

  constructor(private router: Router, private urlService: UrlService) {}

  ngOnInit() {
    this.urlService.getUrls().subscribe((urls) => {
      this._urls = urls;
      this.setUrls();
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

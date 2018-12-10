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

  keyupSub:  Subscription;
  @ViewChild('input') inputElRef: ElementRef;

  constructor(private router: Router, private urlService: UrlService) {}

  ngOnInit() {
    this.urlService.getUrls().subscribe((urls) => {
      this.urls = urls;
      this._urls = urls;
    });
    this.keyupSub = fromEvent(this.inputElRef.nativeElement, 'keyup').pipe(
      debounceTime(100),
      distinctUntilChanged(),
    ).subscribe((event: KeyboardEvent) => {
      this.urls = this._urls.filter(v => v.url.indexOf((<HTMLInputElement>event.target).value) > -1);
    });
  }

  ngOnDestroy() {
    this.keyupSub.unsubscribe();
  }
}

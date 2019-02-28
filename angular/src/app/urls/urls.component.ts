import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription, combineLatest, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { filter, flatMap, map, switchMap } from 'rxjs/operators';
import { of, pipe, from } from 'rxjs';

import { STATUS } from '../constants';



@Component({
  selector: 'app-urls',
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.css']
})
export class UrlsComponent implements OnDestroy, OnInit {
  STATUS = STATUS;

  @ViewChild('input') inputElRef: ElementRef;

  filteredUrls = <any>[];
  _urls = <any>[];

  @Input()
  set urls(urls) {
    if (urls) {
      this._urls = urls;
      this.setUrls();
    }
  }

  get urls() {
    return this._urls;
  }

  @Input() filter: Function = ((u) => true);

  keyupSub:  Subscription;
  filterModel = null;

  constructor() { }

  ngOnInit() {
    this.keyupSub = fromEvent(this.inputElRef.nativeElement, 'keyup').pipe(
      debounceTime(100),
      distinctUntilChanged(),
    ).subscribe((event: KeyboardEvent) => {
      this.setUrls();
    });
  }

  ngOnDestroy() {
    this.keyupSub.unsubscribe();
  }

  setUrls() {
    this.filteredUrls = this.urls
      .filter(v => this.filter(v))
      .filter(v => this.inputElRef.nativeElement.value ? v.url.indexOf(this.inputElRef.nativeElement.value) > -1 : true);
  }

  onChange() {
    this.setUrls();
  }

}

import { Component, OnInit } from '@angular/core';

import { UrlService } from './url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webchecker';
  urls = <any>[];

  constructor(private urlService: UrlService) {}


  ngOnInit() {
    this.urlService.getUrls().subscribe((urls) => this.urls = urls);
  }
}

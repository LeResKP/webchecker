import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { STATUS } from './constants';
import { UrlService } from './url.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webchecker';
  urls = <any>[];
  STATUS = STATUS;

  constructor(private router: Router, private urlService: UrlService) {}

  ngOnInit() {
    this.urlService.getUrls().subscribe((urls) => {
      this.urls = urls;
      // TODO: redirect when there is no id defined
      // this.router.navigate(['/urls', this.urls[0].url_id]);
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { API_URL } from '../urls';
import { UrlService } from '../url.service';


// TODO: get DEVICES from API
const DEVICES = [
  {
    id: 'desktop',
    name: 'Desktop',
  },
  {
    id: 'ipad',
    name: 'iPad',
  },
  {
    id: 'iphone6',
    name: 'iPhone 6',
  }
];


@Component({
  selector: 'app-urls',
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.css']
})
export class UrlsComponent implements OnDestroy, OnInit {

  sub: Subscription;
  public url: any;
  public api_url = API_URL;
  public devices = DEVICES;

  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.urlService.getUrl(+params['id']).subscribe((url) => this.url = url);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

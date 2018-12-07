import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { DEVICES, STATUS } from '../constants';
import { API_URL } from '../urls';
import { UrlService } from '../url.service';


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
  public STATUS = STATUS;

  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.urlService.getUrl(+params['id']).subscribe((url) => this.url = url);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  statusChange(urlId, device, statusId, value) {
    let func;
    if (statusId) {
      func = this.urlService.updateStatus(urlId, statusId, value);
    } else {
      func = this.urlService.createStatus(urlId, device, value);
    }
    func.subscribe();
  }

}

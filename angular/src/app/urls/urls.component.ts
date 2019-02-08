import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
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
  public doingScreenshot = false;
  public validationMessages = [];
  public diff: any;
  public showLayer = true;

  @ViewChild('tabset') tabset: NgbTabset;

  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.urlService.getUrl(+params['id']).subscribe((url) => {
        this.url = url
        if (this.tabset) {
          this.tabset.select(this.tabset.tabs.first.id);
        }
        Array.from(document.querySelectorAll('.screenshots')).forEach((elt) => elt.scrollTop = 0);
      });
      this.urlService.getValidation(+params['id']).subscribe((res) => {
        this.validationMessages = res['messages'];
      });
      this.urlService.getDiff(+params['id']).subscribe((res) => {
        this.diff = res;
      });
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

  doScreenshot(url) {
    this.doingScreenshot = true;
    this.urlService.doScreenshot(url.url_id).subscribe(() => this.doingScreenshot = false);
  }

}

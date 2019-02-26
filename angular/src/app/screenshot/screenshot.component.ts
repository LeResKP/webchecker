import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';

import { DEVICES, STATUS } from '../constants';
import { API_URL } from '../urls';

import { UrlService } from '../url.service';


@Component({
  selector: 'app-screenshot',
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.css']
})
export class ScreenshotComponent implements OnDestroy, OnInit {

  private sub: Subscription;
  public url: any;
  public devices = DEVICES;
  public STATUS = STATUS;
  public api_url = API_URL;

  @ViewChild('tabset') tabset: NgbTabset;

  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.urlService.getUrl(+params['id']).subscribe((url) => {
        this.url = url;
        if (this.tabset) {
          this.tabset.select(this.tabset.tabs.first.id);
        }
        Array.from(document.querySelectorAll('.screenshots')).forEach((elt) => elt.scrollTop = 0);
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

}

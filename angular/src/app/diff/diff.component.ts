import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { UrlService } from '../url.service';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnDestroy, OnInit {

  private sub: Subscription;
  public diff: any;
  public showLayer = true;

  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.urlService.getDiff(+params['id']).subscribe((res) => {
        this.diff = res;
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

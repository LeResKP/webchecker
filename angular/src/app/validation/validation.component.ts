import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UrlService } from '../url.service';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-resource',
  template: `<ul *ngIf="resource" [ngClass]="['resource-status-' + resource.page_status]">
    <li class="resource-url">{{ resource['url'] }} ({{ resource['resource_type'] }})</li>
    <li class="resource-status">{{ resource['http_status'] }} {{ resource['http_status_text'] }}</li>
    <li *ngIf="resource['redirect_to']">
      <div>Redirect to:</div>
      <app-resource [resource]="resource['redirect_to']"></app-resource>
    </li>
    <li *ngIf="resource['resources'].length">
      <div>Resources:</div>
      <app-resource [resource]="r" *ngFor="let r of resource['resources']"></app-resource>
    </li>
    <li *ngIf="resource['urls'].length">
      <div>Urls:</div>
      <app-resource [resource]="u" *ngFor="let u of resource['urls']"></app-resource>
    </li>
  </ul>
  `,
})
export class ResourceComponent {
  @Input() resource: any;

}


@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnDestroy, OnInit {

  private sub: Subscription;
  public valid: boolean;
  public w3c: any;
  public linkchecker: any;

  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.urlService.getValidation(+params['id']).subscribe((res) => {
        this.w3c = res['w3c'];
        this.linkchecker = res['linkchecker'];
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

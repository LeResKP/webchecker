import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UrlService } from '../url.service';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnDestroy, OnInit {

  private sub: Subscription;
  public valid: boolean;
  public validationMessages = [];

  constructor(private route: ActivatedRoute, private urlService: UrlService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.urlService.getValidation(+params['id']).subscribe((res) => {
        this.valid = res['valid'];
        this.validationMessages = res['messages'];
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

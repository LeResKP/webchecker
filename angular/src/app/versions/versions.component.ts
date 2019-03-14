import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { ProjectService } from '../project.service';


@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsComponent implements OnInit, OnDestroy {

  sub: Subscription;
  project$: Observable<any>;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      console.log('params', params);
      this.project$ = this.projectService.getProject$(+params['projectId'])
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

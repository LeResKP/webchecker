import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ProjectService } from '../project.service';


@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnDestroy, OnInit {

  routeSub: Subscription;
  projects: any;

  constructor(private route: ActivatedRoute, public projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.projects$.subscribe(res => {
      this.projects = res;
    });

    this.routeSub = this.route.paramMap.subscribe((params: Params) => {
      this.projectService.setCurrentProject(
        +params.params.projectId,
        +params.params.versionId,
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}

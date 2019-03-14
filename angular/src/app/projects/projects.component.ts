import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ProjectService } from '../project.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {

  projects$: Observable<any>;

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projects$ = this.projectService.projects$;
  }

}

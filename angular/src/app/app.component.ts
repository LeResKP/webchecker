import { Component, OnInit } from '@angular/core';

import { ProjectService } from './project.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  projects: any;

  constructor(public projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.projects$.subscribe(res => {
      this.projects = res;
    });
  }
}

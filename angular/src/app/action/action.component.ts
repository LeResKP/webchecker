import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectService } from '../project.service';


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnDestroy, OnInit {

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.setCurrentAction(this.route.snapshot.data.action);
  }

  ngOnDestroy() {
    this.projectService.resetCurrentAction();
  }

}

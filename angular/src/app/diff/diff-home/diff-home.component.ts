import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ProjectService } from '../../project.service';


@Component({
  selector: 'app-diff-home',
  templateUrl: './diff-home.component.html',
  styleUrls: ['./diff-home.component.css']
})
export class DiffHomeComponent implements OnDestroy, OnInit {

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.setDiffVersion(+this.route.snapshot.params['b_id']);
  }

  ngOnDestroy() {
    this.projectService.diffVersion = null;
  }

}

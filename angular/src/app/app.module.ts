import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProjectGuard } from './project.guard';
import { ProjectLoadedGuard } from './project-loaded.guard';
import { UrlsComponent } from './urls/urls.component';
import { MainComponent } from './main/main.component';
import { DiffComponent } from './diff/diff.component';
import { ScreenshotComponent } from './screenshot/screenshot.component';
import { ValidationComponent } from './validation/validation.component';
import { DiffHomeComponent } from './diff/diff-home/diff-home.component';
import { AppHomeComponent } from './app-home/app-home.component';
import { ActionComponent } from './action/action.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [ProjectGuard],
  },
  {
    path: 'p/:projectId/v/:versionId',
    component: AppHomeComponent,
    canActivate: [ProjectLoadedGuard],
    children: [
      {
        path: '',
        redirectTo: 'v',
        pathMatch: 'full',
      },
      {
        path: 'v',
        component: ActionComponent,
        data: {'action': 'v'},
        children: [
          {
            path: '',
            component: MainComponent,
            data: {'defaultAction': 'validation'},
            children: [
              {
                path: 'urls/:id',
                component: UrlsComponent,
                children: [
                  {
                    path: 'validation',
                    component: ValidationComponent,
                  },
                  {
                    path: 'screenshots',
                    component: ScreenshotComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'd',
        component: ActionComponent,
        data: {'action': 'd'},
        children: [
          {
            path: ':b_id',
            component: DiffHomeComponent,
            children: [
              {
                path: '',
                component: MainComponent,
                data: {'defaultAction': 'diff'},
                children: [
                  {
                    path: 'urls/:id',
                    children: [
                      {
                        path: 'diff',
                        component: DiffComponent,
                      },
                    ],
                  },
                ],
              }
            ]
          },
        ],
      },
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UrlsComponent,
    MainComponent,
    DiffComponent,
    ScreenshotComponent,
    ValidationComponent,
    DiffHomeComponent,
    AppHomeComponent,
    ActionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),

    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

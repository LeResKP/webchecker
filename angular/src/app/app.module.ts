import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProjectGuard } from './project.guard';
import { UrlsComponent } from './urls/urls.component';
import { MainComponent } from './main/main.component';
import { DiffComponent } from './diff/diff.component';
import { ScreenshotComponent } from './screenshot/screenshot.component';
import { ValidationComponent } from './validation/validation.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [ProjectGuard],
  },
  {
    path: 'p/:projectId/v/:versionId',
    children: [
      {
        path: '',
        redirectTo: 'v',
        pathMatch: 'full',
      },
      {
      path: 'v',
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
        {
          path: 'diff',
          component: DiffComponent,
        },
      ],
    },
    {
      path: 'd',
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
    }]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    UrlsComponent,
    MainComponent,
    DiffComponent,
    ScreenshotComponent,
    ValidationComponent
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

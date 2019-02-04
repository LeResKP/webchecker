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


const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [ProjectGuard],
  },
  {
    path: 'p/:projectId/v/:versionId',
    component: MainComponent,
    children: [{
      path: 'urls/:id',
      component: UrlsComponent,
    }]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    UrlsComponent,
    MainComponent
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

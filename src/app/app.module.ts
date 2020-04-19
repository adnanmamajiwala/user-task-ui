import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule} from '@angular/forms';
import { TasksComponent } from './tasks/tasks.component';
import { TaskComponent } from './tasks/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

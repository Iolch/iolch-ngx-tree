import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { ExamplesModule } from 'src/examples';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ExamplesModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

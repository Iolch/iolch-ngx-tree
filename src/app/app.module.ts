import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxTreeModule } from 'src/components/tree';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgxTreeModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

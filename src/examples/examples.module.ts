import { NgModule } from '@angular/core';
import { NgxTreeModule } from 'src/components/tree';
import { ArtistsExampleComponent } from './artists-example/artists-example.component';

@NgModule({
  declarations: [
    ArtistsExampleComponent
  ],
  imports: [
    NgxTreeModule,
  ],
  providers: [],
  bootstrap: [ArtistsExampleComponent],
  exports: [ArtistsExampleComponent],
})
export class ExamplesModule { }

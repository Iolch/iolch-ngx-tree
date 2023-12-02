import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxTreeComponent } from './tree.component';
import { NgxTreeLevelDirective } from './tree-level.directive';

@NgModule({
  declarations: [
    NgxTreeComponent,
    NgxTreeLevelDirective,
  ],
  imports: [CommonModule],
  exports: [NgxTreeComponent, NgxTreeLevelDirective],
})
export class NgxTreeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxTreeComponent } from './tree.component';
import { NgxEmptySearch } from './empty-search.directive';
import { NgxTreeLevelDirective } from './tree-level.directive';

@NgModule({
  declarations: [
    NgxEmptySearch,
    NgxTreeComponent,
    NgxTreeLevelDirective,
  ],
  imports: [CommonModule],
  exports: [NgxTreeComponent, NgxEmptySearch, NgxTreeLevelDirective],
})
export class NgxTreeModule { }

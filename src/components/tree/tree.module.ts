import { NgModule } from '@angular/core';

import { NgxTreeComponent } from './tree.component';
import { NgxTreeNodeDirective } from './tree-node.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NgxTreeComponent,
    NgxTreeNodeDirective,
  ],
  imports: [CommonModule],
  exports: [NgxTreeComponent, NgxTreeNodeDirective],
})
export class NgxTreeModule { }

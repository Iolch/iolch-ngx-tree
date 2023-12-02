import { Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';

import { NgxTreeConfig } from './model/tree.model';
import { NgxTreeNodeDirective } from './tree-node.directive';

@Component({
  selector: 'ngx-tree',
  templateUrl: './tree.component.html'
})
export class NgxTreeComponent {
  
  protected treeNodeTemplate!: TemplateRef<any>;
  
  @Input() config!: NgxTreeConfig<any>;

  @ContentChild(NgxTreeNodeDirective) set treeNode(treeNode: NgxTreeNodeDirective) {
    this.treeNodeTemplate = treeNode.template;
  }
}

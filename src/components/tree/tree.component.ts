import { Component, ContentChildren, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';

import { NgxTreeNodeDirective } from './tree-node.directive';
import { FlatTree, NgxTreeConfig, TreeLevel } from './model/tree.model';

@Component({
  selector: 'ngx-tree',
  templateUrl: './tree.component.html'
})
export class NgxTreeComponent {
  protected flatTree!: FlatTree;

  @Input() config!: NgxTreeConfig<any>;

  @ContentChildren(NgxTreeNodeDirective) set treeNode(treeNodes: QueryList<NgxTreeNodeDirective>) {
    const levels: TreeLevel[] = [];
    
    treeNodes.forEach((treeNode: NgxTreeNodeDirective, level) => {
      levels[level] = {
        template: treeNode.template,
        property: treeNode.property
      };
    });

    this.flatTree = new FlatTree(levels);
    this.flatTree.nodes = this.config.nodes;
  }  
}

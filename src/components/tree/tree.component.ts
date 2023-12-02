import { Component, ContentChildren, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';

import { NgxTreeConfig } from './model/tree.model';
import { NgxTreeNodeDirective } from './tree-node.directive';

interface Level {
  template: TemplateRef<any>;
  property: string;
}

@Component({
  selector: 'ngx-tree',
  templateUrl: './tree.component.html'
})
export class NgxTreeComponent {
  
  protected treeLevels!: Level[];
  
  @Input() config!: NgxTreeConfig<any>;

  @ContentChildren(NgxTreeNodeDirective) set treeNode(treeNodes: QueryList<NgxTreeNodeDirective>) {
    console.log('treeNodes', treeNodes);

    treeNodes.forEach((treeNode: NgxTreeNodeDirective, level) => {
      this.treeLevels[level] = {
        template: treeNode.template,
        property: treeNode.property
      };
    });
  }

  constructor() {
    this.treeLevels = [];
  }
}

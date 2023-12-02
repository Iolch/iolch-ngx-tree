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

  protected flatTree: any[];

  @Input() config!: NgxTreeConfig<any>;

  @ContentChildren(NgxTreeNodeDirective) set treeNode(treeNodes: QueryList<NgxTreeNodeDirective>) {
    treeNodes.forEach((treeNode: NgxTreeNodeDirective, level) => {
      this.treeLevels[level] = {
        template: treeNode.template,
        property: treeNode.property
      };
    });

    this.toFlatTree(this.config.nodes);
  }

  constructor() {
    this.flatTree = [];
    this.treeLevels = [];
  }

  private toFlatTree(nodes: any[], level = 0){
    nodes.forEach((node: any) => this.checkNode(node, level));
  }

  private checkNode(node: any, level = 0){
    this.flatTree.push({...node, template: this.treeLevels[level].template, level});

    const { property } = this.treeLevels[level +1] ?? {};
    const child = node[property];
    if(child){
      this.toFlatTree(child, level + 1);
    }
  }
}

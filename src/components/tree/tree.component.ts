import { Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';

import { NgxEmptySearch } from './empty-search.directive';
import { NgxTreeLevelDirective } from './tree-level.directive';
import { FlatTree, NgxTreeConfig, TreeLevel } from './model/tree.model';

@Component({
  selector: 'ngx-tree',
  templateUrl: './tree.component.html'
})
export class NgxTreeComponent {
  protected flatTree!: FlatTree;

  protected emptySearchTemplate!: TemplateRef<any>;

  @Input() config!: NgxTreeConfig<any>;

  @ContentChildren(NgxTreeLevelDirective) set treeLevel(treeLevels: QueryList<NgxTreeLevelDirective>) {
    const levels = treeLevels.map(({template, name, searchableBy}: NgxTreeLevelDirective, index) => {
      return new TreeLevel({template, name, searchProperty: searchableBy, index});
    });

    this.flatTree = new FlatTree(levels);
    this.flatTree.nodes = this.config.nodes;
  }  

  @ContentChild(NgxEmptySearch) set emptySearch(emptySearch: NgxEmptySearch) {
    this.emptySearchTemplate = emptySearch.template;
  }  

  public search(search: string): void {
    const { includeAscendantsOnSearch: includeAscendants = false} = this.config;
    this.flatTree.search.next({search, includeAscendants});
  }
}

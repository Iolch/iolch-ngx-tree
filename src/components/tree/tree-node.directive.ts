import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[ngxTreeNode]',
})
export class NgxTreeNodeDirective {

  constructor(
    private templateRef: TemplateRef<any>
  ) {}

  public get template(): TemplateRef<any> {
    return this.templateRef;
  }
}
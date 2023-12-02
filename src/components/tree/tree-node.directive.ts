import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[ngxTreeNode]',
})
export class NgxTreeNodeDirective {
  @Input() property : string;

  constructor(private templateRef: TemplateRef<any>) {
    this.property = 'root';
  }

  public get template(): TemplateRef<any> {
    return this.templateRef;
  }
}
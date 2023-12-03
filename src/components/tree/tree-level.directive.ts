import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[ngxTreeLevel]',
})
export class NgxTreeLevelDirective {
  @Input() name !: string;

  @Input() searchableBy !: string;

  constructor(private templateRef: TemplateRef<any>) {
  }

  public get template(): TemplateRef<any> {
    return this.templateRef;
  }
}
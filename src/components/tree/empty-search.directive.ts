import {Directive, TemplateRef} from '@angular/core';

@Directive({
  selector: '[ngxEmptySearch]',
})
export class NgxEmptySearch {

  constructor(private templateRef: TemplateRef<any>) {
  }

  public get template(): TemplateRef<any> {
    return this.templateRef;
  }
}
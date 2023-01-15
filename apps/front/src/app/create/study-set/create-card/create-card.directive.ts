import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[scholarsomeCardList]'
})
export class CreateCardDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

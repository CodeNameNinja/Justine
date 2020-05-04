import { Directive, TemplateRef, ViewContainerRef,OnInit } from '@angular/core';

@Directive({
  selector: '[carouselSlide]'
})
export class CarouselDirective implements OnInit {

  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }

  ngOnInit()
  {
    this.viewContainer.createEmbeddedView(this.templateRef)
  }
}

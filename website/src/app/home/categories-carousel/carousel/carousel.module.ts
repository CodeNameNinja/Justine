import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselComponent, CarouselSlideElement } from './carousel.component';
import { CarouselDirective } from './carousel.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [CarouselComponent, CarouselDirective, CarouselSlideElement],
  exports: [CarouselComponent, CarouselDirective]

})
export class CarouselModule { }

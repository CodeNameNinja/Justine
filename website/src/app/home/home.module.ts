import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { CarouselModule } from './categories-carousel/carousel/carousel.module';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomePageRoutingModule } from './home.routing.module';
import {
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';
import { ProductPageModule } from '../product-item/product-item.module';
import { CategoriesCarouselComponent } from './categories-carousel/categories-carousel.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    HomePageRoutingModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ProductPageModule
  ],
  declarations: [HomeComponent, CategoriesCarouselComponent],
  providers: []

})
export class HomePageModule {}

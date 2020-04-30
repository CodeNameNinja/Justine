import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomePageRoutingModule } from './home.routing.module';
import {
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material'
import { ProductPageModule } from '../product-item/product-item.module';


@NgModule({
  imports: [
    CommonModule,
    HomePageRoutingModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ProductPageModule
  ],
  declarations: [HomeComponent],
  providers:[]

})
export class HomePageModule {}

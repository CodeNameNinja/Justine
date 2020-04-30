import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material'
import { ProductItemComponent } from './product-item.component';
import { ProductPageRoutingModule } from './product-item-routing.module';
import { FormsModule } from "@angular/forms"

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule,
    ProductPageRoutingModule
  ],
  declarations: [ProductItemComponent],
  exports:[
    ProductItemComponent
  ]

})
export class ProductPageModule {}

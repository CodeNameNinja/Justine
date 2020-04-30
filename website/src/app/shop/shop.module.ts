import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopPageRoutingComponent } from './shop.routing.module';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatButtonModule,
  MatCardModule,
  MatSliderModule,
  MatSelectModule,
  MatCheckboxModule,

} from '@angular/material';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductPageModule } from '../product-item/product-item.module';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ShopPageRoutingComponent,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    MatSelectModule,
    MatCheckboxModule,
    ProductPageModule
   ],
  declarations: [ShopComponent, FilterBarComponent, ProductDetailsComponent],
  providers: [],
})
export class ShopPageModule {}

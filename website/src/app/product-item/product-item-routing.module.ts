import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductItemComponent } from './product-item.component';


const routes: Routes = [{
  path: '',
  component: ProductItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProductPageRoutingModule {}

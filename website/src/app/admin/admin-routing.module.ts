import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminComponent, AddProductComponent } from './admin.component';
import { AllProductsComponent } from './all-products/all-products.component';

const routes: Routes = [
  {
  path: '',
  component: AdminComponent
},
  {
  path: 'all-products',
  component: AllProductsComponent
},
  {
  path: 'edit/:prodId',
  component: AddProductComponent
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdminPageRoutingModule {}

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminComponent} from './admin.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { AdminOrderComponent } from './order/order.component'
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { DashboardComponent, AddProductComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
  path: '',
  component: AdminComponent,
  children:[
    {
      path: 'dashboard',
      component: DashboardComponent
    },
      {
      path: 'all-products',
      component: AllProductsComponent
    },
      {
      path: 'edit/:prodId',
      component: AddProductComponent
    },
    {
     path: 'orders',
     component: AllOrdersComponent
    },
    {
      path:':id',
      component: AdminOrderComponent
    }
  ]
},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdminPageRoutingModule {}

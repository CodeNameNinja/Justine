import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyAccountComponent } from './my-account.component';
import { AddressComponent } from './address/address.component';
import { DetailsComponent } from './details/details.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';



const routes: Routes = [{
  path: '',
  component: MyAccountComponent,
  children: [
   {
     path: 'my-details',
    component: DetailsComponent
  },
   {
     path: 'my-address',
    component: AddressComponent
  },
   {
     path: 'my-orders',
    component: MyOrdersComponent
  },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class MyAccountPageRoutingModule {}

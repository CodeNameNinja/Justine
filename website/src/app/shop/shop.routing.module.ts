import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';


const routes: Routes = [{
  path: '',
  component: ShopComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ShopPageRoutingComponent {}

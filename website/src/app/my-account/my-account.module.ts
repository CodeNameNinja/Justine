import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountPageRoutingModule } from './my-account-routing.module';
import {
  MatProgressSpinnerModule,
  MatListModule,
  MatIconModule,
  MatRippleModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule
} from '@angular/material'
import { MyAccountComponent } from './my-account.component';
import { AddressComponent } from './address/address.component';
import { DetailsComponent } from './details/details.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    MyAccountPageRoutingModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  declarations: [MyAccountComponent, AddressComponent, DetailsComponent, MyOrdersComponent],
  providers:[]

})
export class MyAccountModule {}

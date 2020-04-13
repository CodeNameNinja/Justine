import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomePageRoutingModule } from './home.routing.module';
import {
  MatProgressSpinnerModule,
} from '@angular/material'

@NgModule({
  imports: [
    CommonModule,
    HomePageRoutingModule,
    MatProgressSpinnerModule
  ],
  declarations: [HomeComponent],
  providers:[]

})
export class HomePageModule {}

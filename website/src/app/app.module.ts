import { BrowserModule, HAMMER_GESTURE_CONFIG  } from '@angular/platform-browser';
import {
  GestureConfig,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatStepperModule,
  MatTableModule
 } from '@angular/material';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent, OrderDialog } from './cart/cart.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CartComponent,
    OrderDialog,
    LoginComponent,
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  entryComponents:[OrderDialog],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
],
  bootstrap: [AppComponent]
})
export class AppModule { }

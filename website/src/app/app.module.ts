import { BrowserModule, HAMMER_GESTURE_CONFIG  } from '@angular/platform-browser';
import {
  GestureConfig,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatStepperModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatCardModule
 } from '@angular/material';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CartComponent, OrderDialog } from './cart/cart.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-incerceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { ResetComponent } from './auth/reset/reset.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';
import { SuccessComponent } from './success/success.component';
import { FooterComponent } from './footer/footer.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SuccessInterceptor } from './success-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CartComponent,
    OrderDialog,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    ResetComponent,
    NewPasswordComponent,
    SuccessComponent,
    FooterComponent,
    ContactComponent,
    AboutComponent,


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
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatCardModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents:[OrderDialog,ErrorComponent,SuccessComponent],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, multi: true },
],
  bootstrap: [AppComponent]
})
export class AppModule { }

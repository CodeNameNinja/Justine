import { NgModule } from '@angular/core';
import { AdminPageRoutingModule } from './admin-routing.module';
import { AdminComponent, AddProductComponent, DeleteProductAlert } from './admin.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatButtonModule,
  MatSelectModule,
  MatCardModule,
  MatSidenavModule
} from '@angular/material';
import { AllProductsComponent } from './all-products/all-products.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  imports: [
    CommonModule,
    AdminPageRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatSidenavModule
  ],
  declarations: [AdminComponent, AddProductComponent, AllProductsComponent, SidenavComponent,DeleteProductAlert],
  entryComponents:[AddProductComponent, DeleteProductAlert]
})
export class AdminPageModule {}

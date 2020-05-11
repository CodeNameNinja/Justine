import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Product } from 'src/app/models/product.model';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/internal/operators/map';
import { AddProductComponent, DeleteProductAlert } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  isLoading = false;
  products: Product[] = [];

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getProducts();

  }
  async getProducts(){
    this.isLoading = true;
    await this.adminService.getProducts();
    await this.adminService.getProductUpdateListener()
    .subscribe((productData: {products: Product[]}) => {
      this.products = productData.products;
      this.isLoading = false;
      // console.log(this.products)
    });
  }

  openDialog(product = null, mode = 'create') {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: 'calc(500px + (750 - 500) * ((100vw - 300px) / (1600 - 300)))',
      maxWidth: '100vw !important',
      data: {
        product
        , mode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });


  }
  deleteProductAlert(id, product) {
    // console.log(id, ship);
    const prodId = id;
    const productName =  product;
    const dialogRef = this.dialog.open(DeleteProductAlert, {
      width: '250px',
      data: {prodId, productName }
    });

    const deleteProduct = (id) => {
      if (id !== undefined) {
        this.deleteProduct(id);
        // this.openSnackbar('ship Removed');
      }

    };

    dialogRef.afterClosed().subscribe(id => {
        // console.dir(id);
        deleteProduct(id);
    });
  }

  deleteProduct(id) {
    this.isLoading = true;
    // console.log(id);
    this.adminService.postDeleteProduct(id)
    .subscribe(res => {
      // console.log(res);
      this.getProducts();
      this.isLoading = false;
    });
  }
}

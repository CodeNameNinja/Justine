import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Product } from 'src/app/models/product.model';
import { AddProductComponent, DeleteProductAlert } from '../admin.component';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/internal/operators/map';

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
    this.getProducts()
    this.adminService.getProductUpdateListener().subscribe(products => {
      this.getProducts();
    })

  }
  getProducts(){
    this.isLoading = true;
    this.adminService.getProducts()
    .pipe(
      map(productData => {
        return productData.products.map(product => {
          return {
            title: product.title,
            description: product.description,
            amount: product.amount,
            category: product.category,
            sizes: product.sizes,
            id: product._id,
            imageUrls: product.imageUrls
          };
        });
      })
    )
    .subscribe((transformedProducts: Product[]) => {
      this.products = transformedProducts;
      this.isLoading = false;
    });
  }

  openDialog(product = null, mode = 'create') {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '50vw',
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

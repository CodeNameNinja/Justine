import { Component, OnInit, DoCheck } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, DoCheck {
  products: Product[] = [];
  isLoading = false;
  filteredCategories;
  filteredProducts;
  maxiumPrice;
  constructor(
    private adminService: AdminService,
   ) {}

  ngOnInit() {
    this.getProducts();
  }
  ngDoCheck() {
    console.log(this.products);
  }

  getProducts() {

    this.isLoading = true;
    return new Promise((resolve, reject) => {
      this.adminService.getProducts()
      .pipe(
        map(productData => {
          return productData.products.map(product => {
            return {
              title: product.title,
              description: product.description,
              amount: product.amount,
              category: product.category,
              id: product._id,
              imageUrls: product.imageUrls
            };
          });
        })
      )
      .subscribe(transformedProducts => {
        this.products = transformedProducts;

        resolve(this.products);
        this.isLoading = false;
      });

    });

  }
   updateCategories(event: any[]) {

     return new Promise((resolve, reject) => {
      const categories = [];
      this.filteredCategories = event;
      for (const filteredCategories of event) {
       categories.push(filteredCategories.name);
       this.getProducts().then((httpProducts: Product[]) => {
        this.filteredProducts = httpProducts.filter(products => {
          return categories.includes(products.category);
         });
       }).then(() => {

        resolve(this.products = this.filteredProducts);
       });
     }
     });
  }

  updatedMaxiumPrice(maxiumPrice) {
    const filterProducts = this.filteredProducts;
    this.maxiumPrice = maxiumPrice;
    this.products = filterProducts.filter(updatedProducts => {
            return updatedProducts.amount < maxiumPrice;
          });
  }
}

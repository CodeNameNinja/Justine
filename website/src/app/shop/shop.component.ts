import { Component, OnInit, DoCheck, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { ShopService } from '../services/shop.service';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  filteredCategories;
  filteredProducts;
  maxiumPrice;
 @Output() updateCart = new EventEmitter<any>();
  constructor(
    private adminService: AdminService,
    private shopService: ShopService,
   ) {}

  ngOnInit() {
    // this.getProducts();
  }


  getProducts() {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      this.adminService.getProducts();
      this.adminService.getProductUpdateListener()
      .subscribe((productData: {products: Product[]}) => {
        this.products = productData.products;
        resolve(this.products);
        this.isLoading = false;
      });
    });
  }

   updateCategories(event) {
     this.getProducts().then((products: Product[]) => {
       const categories = [];
       for (const filteredCategories of event) {
         categories.push(filteredCategories.name);
        }
       this.filteredProducts = products.filter(fProducts => {
         return categories.includes(fProducts.category);
        });

       this.products = this.filteredProducts;
      //  console.log("Shop Component:", this.products)
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

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
  updateSaleProducts(event) {
    if (event) {
      this.getProducts().then((products: Product[]) => {
        this.filteredProducts = products.filter(product => {
          return product.discount > 0;
        });
        this.products = this.filteredProducts;

      })
    } else {
      this.getProducts().then((products: Product[]) => {
        this.filteredProducts = products;
        // this.shopService.onSale.next(false);
      });
    }
  }

   updateCategories(event) {
      if(this.filteredProducts){
        const categories = [];
        for (const filteredCategories of event) {
          categories.push(filteredCategories.name);
        }
        this.products = this.filteredProducts.filter(fProducts => {
          return categories.includes(fProducts.category);
        });
      }
      else return;

  }

  updatedMaxiumPrice(maxiumPrice) {
    const filterProducts = this.filteredProducts;
    this.maxiumPrice = maxiumPrice;
    this.products = filterProducts.filter(updatedProducts => {
            return updatedProducts.amount < maxiumPrice;
          });
  }

}

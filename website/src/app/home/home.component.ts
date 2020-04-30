import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  constructor(
    private adminService: AdminService,
    public shopService: ShopService
  ) { }

  async ngOnInit() {
    await this.getProducts();
  }

  getProducts() {
    const last = function last(array, n) {
      if (array == null) { return void 0; }
      if (n == null) { return array[array.length - 1]; }
      return array.slice(Math.max(array.length - n, 0));
    };
    this.isLoading = true;
    this.adminService.getProducts()
    .pipe(
      map(productData => {
        return productData.products.map(product => {
          const convertedSizes = [];
          Object.entries(product.sizes).forEach(([key, value]) => {
            convertedSizes.push({size:key, quantity:value});
          });
          return {
            title: product.title,
            description: product.description,
            amount: product.amount,
            category: product.category,
            sizes: convertedSizes,
            id: product._id,
            imageUrls: product.imageUrls
          };
        });
      })
    )
    .subscribe(transformedProducts => {
    this.products = last(transformedProducts, 4);
    this.isLoading = false;
    });
  }




}

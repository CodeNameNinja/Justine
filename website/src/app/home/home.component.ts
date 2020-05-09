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
    this.adminService.getProducts();
    this.adminService.getProductUpdateListener()
    .subscribe((productData: {products: Product[]}) => {
    this.products = last(productData.products, 4);
    this.isLoading = false;
    });
  }




}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { pipe, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = false;
userIsAuthenticated = false;
private authListenerSubs: Subscription;
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    public shopService: ShopService
  ) { }

  async ngOnInit() {
    await this.getProducts();
    this.userIsAuthenticated = await this.authService.getIsAuth();
    this.authListenerSubs = await this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  getProducts() {
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
            id: product._id,
            imageUrls: product.imageUrls
          };
        });
      })
    )
    .subscribe(transformedProducts => {
    this.products = transformedProducts.splice(0,4);
      // console.log('transform Products', this.products);
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}

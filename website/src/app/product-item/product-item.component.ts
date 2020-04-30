import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Product } from '../models/product.model';
import { ShopService } from '../services/shop.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  userIsAuthenticated = false;
  selectedSize:string = "medium";
  private authListenerSubs: Subscription;
  constructor(
    private shopService: ShopService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    // console.log(this.product)
    this.userIsAuthenticated = await this.authService.getIsAuth();
    this.authListenerSubs = await this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }


  addToCart(id) {

    this.shopService.addToCart(id, this.selectedSize).subscribe((cart) => {
      this.shopService.updateCart.next(cart);
      // console.log("response", response)
    });

  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}

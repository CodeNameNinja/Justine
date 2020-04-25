import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  isLoading = false;
  id: string;
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.shopService.getProduct(this.id)
     .subscribe(productData => {
       this.product = productData.product;
       this.isLoading = false;
     })
    });
  }
  addToCart(){
    this.shopService.addToCart(this.id).subscribe((cart) => {
      this.shopService.updateCart.next(cart);
      // console.log("response", response)
    });

  }
}

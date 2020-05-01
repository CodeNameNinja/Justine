import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  isLoading = false;
  id: string;
  selectedSize = 'medium';
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.shopService.getProduct(this.id)
      .pipe(
        map(productData => {
          // return productData.product.map(product => {
          const convertedSizes = [];
          Object.entries(productData.product.sizes).forEach(([key, value]) => {
              convertedSizes.push({size: key, quantity: value});
            });
          return {
              title: productData.product.title,
              description: productData.product.description,
              amount: productData.product.amount,
              category: productData.product.category,
              sizes: convertedSizes,
              id: productData.product._id,
              imageUrls: productData.product.imageUrls
            };
          // });
        })
      )
      .subscribe((transformedProduct => {
        // console.log(transformedProduct)
      this.product = transformedProduct;
      this.isLoading = false;
      }));
    });
  }
  addToCart() {
    this.shopService.addToCart(this.id, this.selectedSize).subscribe((cart) => {
      this.shopService.updateCart.next(cart);
      // console.log("response", response)
    });

  }
}

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.getProducts();
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
      console.log('transform Products', this.products);
      this.isLoading = false;
    });
  }
}

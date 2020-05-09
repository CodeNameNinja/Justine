import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  products: Product[] = [];
  productsUpdated = new Subject<{products: Product[]}>();
  headers = new HttpHeaders({ 'Content-Type': 'application/JSON' });
  constructor(private http: HttpClient, private router: Router) {}
  postDeleteProduct(id: string) {
    console.log(id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/JSON; charset=utf-8',
    });
    return this.http.post(
      `${environment.apiUrl}/admin/delete-product`,
      { id },
      { headers }
    );
  }
  getProducts() {
    return this.http
      .get<{ message: string; products: any }>(
        `${environment.apiUrl}/admin/add-product`
      )
      .pipe(
        map(productData => {
          return {
            products:
              productData.products.map(product => {
                const convertedSizes = [];
                Object.entries(product.sizes).forEach(([key, value]) => {
      convertedSizes.push({size: key, quantity: value});
    });
                return {
                  title: product.title,
                  description: product.description,
                  amount: product.amount,
                  category: product.category,
                  sizes: convertedSizes,
                  id: product._id,
                  imageUrls: product.imageUrls,
                };
              })
          };
        })
      )
      .subscribe(transformProducts => {
        this.products = transformProducts.products;
        this.productsUpdated.next({
          products: [...this.products],
        });
      });
  }
  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }
  addProduct(productData: FormData) {
    const title = productData.get('title').toString();
    const description = productData.get('description').toString();
    const amount = productData.get('amount').toString();
    const category = productData.get('category').toString();
    const sizes = productData.get('sizes');
    // console.log("sizes",sizes.toString());
    // console.log(productData.get('sizes.small'));
    this.http
      .post<{ message: string; product: Product }>(
        `${environment.apiUrl}/admin/add-product`,
        productData
      )
      .subscribe((responseData) => {
        // console.log(responseData);
        const product: any = {
          id: responseData.product.id,
          title,
          description,
          amount: +amount,
          category,
          sizes: JSON.parse(sizes.toString()),
          imageUrls: responseData.product.imageUrls,
        };

        new Promise((resolve, reject) => {
          resolve(this.products.push(product));
        }).then(() => {
          this.productsUpdated.next({
            products: this.products
          });
          // console.log('this.products', this.products);
        });
      });
  }

  updateProduct(id, productData: FormData) {
    return this.http.put(
      `${environment.apiUrl}/admin/update-product/` + id,
      productData
    );
  }

  getAllOrders() {
    return this.http.get<{ message: string; orders: any }>(
      `${environment.apiUrl}/admin/orders`
    );
  }

  getOrder(id: string) {
    return this.http.get<{ message: string; order: any }>(
      `${environment.apiUrl}/admin/order/${id}`
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, BehaviorSubject } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  hideSideNav = true;
  hideSuccessMessage = true;
  updateCart = new Subject();
  getCartLength = new Subject();
  CartLength;
  filterCategories = new BehaviorSubject("all");
  onSaleChecked = false
  constructor(
    private http: HttpClient
  ) {
    this.getCartLength.subscribe(length => {
      this.CartLength = length;
    });
  }

  public toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }
  public closeSideNav(): void {
    this.hideSideNav = true;
  }

  public getCart() {
    return this.http.get(`${environment.apiUrl}/shop/cart`);
  }
  addToCart(id,size) {
   return this.http.post(`${environment.apiUrl}/shop/cart`, {id, size});
  }
  deleteProduct(id) {
    return this.http.post(`${environment.apiUrl}/shop/cart-delete-item`, {id});
  }

  createOrder(orderDetails) {
    return this.http.post(`${environment.apiUrl}/shop/create-order`, {orderDetails});

  }

  getProduct(id) {
    return this.http.get<{message: string, product: any}>(`${environment.apiUrl}/shop/product/${id}`);
  }

  getOrder() {
    return this.http.get<{message: string, orders: any}>(`${environment.apiUrl}/shop/orders`)
  }


}

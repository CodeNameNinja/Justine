import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  hideSideNav: boolean = true;
  hideSuccessMessage: boolean = true;
  updateCart = new Subject();
  getCartLength = new Subject();
  CartLength;
  constructor(
    private http: HttpClient
  ) {

    this.getCartLength.subscribe(length => {
      this.CartLength = length;
      // console.log(length)
    })
  }

  public toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }

  public toggleSuccessMessage(): void {
    this.hideSuccessMessage = !this.hideSuccessMessage;
    // console.log(this.hideSuccessMessage)
  }

  public getCart(){
    return this.http.get(`${environment.apiUrl}/shop/cart`);
  }
  addToCart(id) {
   return this.http.post(`${environment.apiUrl}/shop/cart`, {id});
  }
  deleteProduct(id){
    return this.http.post(`${environment.apiUrl}/shop/cart-delete-item`, {id});
  }

  createOrder(orderDetails){
    return this.http.post(`${environment.apiUrl}/shop/create-order`, {orderDetails});

  }

}

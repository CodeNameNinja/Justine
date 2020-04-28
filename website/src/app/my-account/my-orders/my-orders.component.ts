import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
 orders:Order[]
  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit() {
    this.shopService.getOrder()
    .subscribe(orderData => {
      this.orders = orderData.orders
    })
  }

}

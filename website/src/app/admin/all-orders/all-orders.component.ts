import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Order } from 'src/app/models/order.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {

      this.isLoading = true;
      this.adminService.getAllOrders().
      pipe(
        map(orderData => {
          console.log(orderData);
          return orderData.orders.map((order: Order) => {
            return {
              _id: order._id,
              orderDetails: {
                create_time: order.orderDetails.create_time,
                id: order.orderDetails.id,
                payer: {
                  address: {
                    country_code: order.orderDetails.payer.address.country_code,
                  },
                  email_address: order.orderDetails.payer.email_address,
                  name: {
                    given_name: order.orderDetails.payer.name.given_name,
                    surname: order.orderDetails.payer.name.surname
                  },
                  payer_id: order.orderDetails.payer.payer_id
                },
                purchase_units: [
                  {
                    amount: {
                      value: order.orderDetails.purchase_units[0].amount.value,
                      currency_code: order.orderDetails.purchase_units[0].amount.currency_code,
                    },
                    payee: {
                      email_address: order.orderDetails.purchase_units[0].payee.email_address,
                      merchant_id: order.orderDetails.purchase_units[0].payee.merchant_id,
                    },
                    shipping: {
                      address: {
                        address_line_1: order.orderDetails.purchase_units[0].shipping.address.address_line_1,
                        aaddress_line_2: order.orderDetails.purchase_units[0].shipping.address.address_line_2,
                        admin_area_1: order.orderDetails.purchase_units[0].shipping.address.admin_area_1,
                        admin_area_2: order.orderDetails.purchase_units[0].shipping.address.admin_area_2,
                        country_code: order.orderDetails.purchase_units[0].shipping.address.country_code,
                        postal_code: order.orderDetails.purchase_units[0].shipping.address.postal_code                    },
                      name: {
                        full_name: order.orderDetails.purchase_units[0].shipping.name.full_name
                      }
                    }
                  }
                ]
              },
              products: order.products,
              user: {
                name: order.user.name,
                userId: order.user.userId
              }
            };
          });
        })
      )
      .subscribe((transformedOrders: Order[]) => {
        this.orders = transformedOrders;
        this.isLoading = false;
      }, err => console.log(err));

    }



}

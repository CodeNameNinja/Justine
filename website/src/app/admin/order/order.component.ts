import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Order } from "src/app/models/order.model";
import { AdminService } from "src/app/services/admin.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-admin-orde",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class AdminOrderComponent implements OnInit {
  order: Order = {orderDetails: {payer:{name: {} as any}as any} as any} as any;
  id: string;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.adminService.getOrder(this.id)
     .subscribe(orderData => {
       this.order = orderData.order;
       this.isLoading = false;
     })
    });
  }
}

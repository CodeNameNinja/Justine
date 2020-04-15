import { Component, OnInit, Inject } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Product } from '../models/product.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],

})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number;
  isLoading = false;

  animal: string;
  name: string;
  constructor(
    public shopService: ShopService,
    public dialog: MatDialog ) { }

  ngOnInit() {
    this.getCart();
    return new Promise((resolve,reject) => {
      this.shopService.updateCart.subscribe((response) => {
        console.log(response)
        resolve(this.getCart());
      });
    })
  }

 getCart() {
   this.isLoading = true;
   const itemsQuantity = [];
   this.totalAmount = 0;
   this.cartItems = [];
   const cartTotal = [];
   this.shopService.getCart().subscribe((items: CartItem[]) => {
     this.isLoading = false;
     for (const item of items) {
      this.cartItems.push(item);
      const itemAmount = item.quantity * item.productId.amount;
      cartTotal.push(itemAmount);
      itemsQuantity.push(item.quantity);
    }

     this.totalAmount = cartTotal.reduce((a, b) => {
      return a + b;
    }, 0);
     const quantity = itemsQuantity.reduce((a, b) => {
      return a + b;
    }, 0);
     this.shopService.getCartLength.next(quantity);
   });
 }

 deleteCartItem(id) {
   this.isLoading = true;
   this.shopService.deleteProduct(id).subscribe(response => {
     this.isLoading = false;
     console.log(response);
     this.getCart();
   });
 }



 openOrdeDialog(): void {
  const dialogRef = this.dialog.open(OrderDialog, {
    width: 'auto',
    height: 'auto',
    data: {name: this.name, animal: this.animal}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.animal = result;
  });
}

}
@Component({
  selector: 'app-order-component',
  templateUrl: './order/order.component.html',
  styleUrls: ['./order/order.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class OrderDialog implements OnInit {
  personalDetailsForm: FormGroup;
  ShippingBillingForm: FormGroup;
  subTotal: number;
  orderTotal: number;
  displayedColumns: string[] = ['position', 'title', 'quantity', 'price'];
  dataSource: OrderItem[] = [];
  orderDetails: Order = {
    fullName: '',
    phoneNumber: 0,
    emailAddress: '',
    streetAddress: '',
    country: '',
    zipCode: 0,
    city: ''
  };

  constructor(
    public dialogRef: MatDialogRef<OrderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public shopService: ShopService) {}

    ngOnInit() {
      this.getCart();
      this.personalDetailsForm = new FormGroup({
        fullName: new FormControl(' ', {
          validators: [Validators.required, Validators.minLength(3)]
        }),
        phoneNumber: new FormControl('', {
          validators: [Validators.required, Validators.pattern('[0-9 ]{10}')]
        }),
        emailAddress: new FormControl('', {
          validators: [Validators.required, Validators.email]
        })

      });
      this.ShippingBillingForm = new FormGroup({
        streetAddress: new FormControl(null, {
          validators: [Validators.required]
        }),
        country: new FormControl('South Africa', {
          validators: [Validators.required]
        }),
        city: new FormControl(null, {
          validators: [Validators.required]
        }),
        postalCode: new FormControl(null, {
          validators: [Validators.required]
        })
      });
    }

    getCart() {
      const items = [];
      this.shopService.getCart().subscribe((cartItems: CartItem[]) => {
        const cartTotal = [];
        for (let index = 0; index < cartItems.length; index++) {
          items.push({
            position: index + 1,
            title: cartItems[index].productId.title,
            imageUrl: cartItems[index].productId.imageUrls[0],
            quantity: cartItems[index].quantity,
            price: cartItems[index].productId.amount
          });


          const itemAmount = cartItems[index].quantity * cartItems[index].productId.amount;
          cartTotal.push(itemAmount);
        }

        this.subTotal = cartTotal.reduce((a, b) => {
          return a + b;
        }, 0);

        const shippingFee = 100;
        this.orderTotal = this.subTotal + shippingFee;
        this.dataSource = items;
      });

    }
    setOrderDetails() {
      const fullName = this.personalDetailsForm.value.fullName;
      const phoneNumber = this.personalDetailsForm.value.phoneNumber;
      const email = this.personalDetailsForm.value.emailAddress;
      const streetAddress = this.ShippingBillingForm.value.streetAddress;
      const country = this.ShippingBillingForm.value.country;
      const city = this.ShippingBillingForm.value.city;
      const zipCode = this.ShippingBillingForm.value.postalCode;

      this.orderDetails.fullName = fullName;
      this.orderDetails.phoneNumber = phoneNumber;
      this.orderDetails.emailAddress = email;

      this.orderDetails.city = city;
      this.orderDetails.country = country;
      this.orderDetails.zipCode = zipCode;
      this.orderDetails.streetAddress = streetAddress;
    }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
interface CartItem {
  _id: string;
  productId: {
    _id: string;
    amount: number;
    category: string;
    description: string;
    imageUrls: string[];
    title: string;
    userId: string
  };
  quantity: number;
}
interface DialogData {
  animal: string;
  name: string;
}

interface Order {
  fullName: string;
  phoneNumber: number;
  emailAddress: string;
  streetAddress: string;
  country: string;
  city: string;
  zipCode: number;
}

export interface OrderItem {
  position: number;
  title: string;
  imageUrl: string;
  quantity: number;
  price: number;
}


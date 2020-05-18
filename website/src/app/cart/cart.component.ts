import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Product } from '../models/product.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var paypal;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount: number;
  isLoading = false;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  animal: string;
  name: string;
  constructor(
    public shopService: ShopService,
    public authService: AuthService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.getCart();
    }
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.getCart();
        }
      });

    this.shopService.updateCart.subscribe((cartItems: CartItem[]) => {
      // console.log(cartItems)
      if (!cartItems) {
        this.cartItems = [];
        this.totalAmount = 0;
        this.shopService.getCartLength.next(0);
        return;
      }
      const itemsQuantity = [];
      const cartTotal = [];

      for (const item of cartItems) {
        itemsQuantity.push(item.quantity);

        const itemAmount = item.quantity * item.productId.amount;

        cartTotal.push(itemAmount);
      }
      this.cartItems = cartItems;

      const quantity = itemsQuantity.reduce((a, b) => {
        return a + b;
      }, 0);
      this.totalAmount = cartTotal.reduce((a, b) => {
        return a + b;
      }, 0);
      this.shopService.getCartLength.next(quantity);
    });
  }

  getCart() {
    this.isLoading = true;
    const itemsQuantity = [];
    this.totalAmount = 0.00;
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
    this.shopService.deleteProduct(id).subscribe((response) => {
      this.isLoading = false;
      console.log(response);
      this.getCart();
    });
  }

  openOrdeDialog(): void {
    const dialogRef = this.dialog.open(OrderDialog, {
      width: 'calc(500px + (750 - 500) * ((100vw - 300px) / (1600 - 300)))',
      maxWidth: '100vw !important',
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
@Component({
  selector: 'app-order-component',
  templateUrl: './order/order.component.html',
  styleUrls: ['./order/order.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class OrderDialog implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  personalDetailsForm: FormGroup;
  ShippingBillingForm: FormGroup;
  subTotal: number;
  orderTotal: number;
  displayedColumns: string[] = ['position', 'title', 'quantity', 'price'];
  provinces = [
    { name: 'Western Cape', value: 'WC' },
    { name: 'Eastern Cape', value: 'EC' },
    { name: 'Free State', value: 'FC' },
    { name: 'Gauteng', value: 'GP' },
    { name: 'KwaZulu-Natal', value: 'KZN' },
    { name: 'Limpopo', value: 'LP' },
    { name: 'Mpumalanga', value: 'MP' },
    { name: 'Northern Cape', value: 'NC' },
    { name: 'North West', value: 'NW' },
  ];
  dataSource: OrderItem[] = [];
  orderDetails: Order = {
    fullName: '',
    phoneNumber: 0,
    emailAddress: '',
    streetAddressLineOne: '',
    streetAddressLineTwo: '',
    province: '',
    country: '',
    zipCode: 0,
    city: '',
  };
  userDetails: { name: string; email: string } = { name: '', email: '' };
  xRate: number
  constructor(
    public dialogRef: MatDialogRef<OrderDialog>,
    public shopService: ShopService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get("https://openexchangerates.org/api/latest.json?app_id=7de047307b5e48819e45bc9250e8d59a")
    .subscribe((res:any) => {
      this.xRate = res.rates.ZAR;
      console.log(this.xRate)
    })
    this.userDetails.name = this.authService.name;
    this.userDetails.email = this.authService.email;

    this.getCart();
    this.personalDetailsForm = new FormGroup({
      fullName: new FormControl(this.userDetails.name, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      phoneNumber: new FormControl('', {
        validators: [Validators.required, Validators.pattern('[0-9 ]{10}')],
      }),
      emailAddress: new FormControl(this.userDetails.email, {
        validators: [Validators.required, Validators.email],
      }),
    });
    this.ShippingBillingForm = new FormGroup({
      streetAddressLineOne: new FormControl(null, {
        validators: [Validators.required],
      }),
      streetAddressLineTwo: new FormControl(null, {
        validators: [Validators.required],
      }),
      province: new FormControl(null, {
        validators: [Validators.required],
      }),
      country: new FormControl('South Africa', {
        validators: [Validators.required],
      }),
      city: new FormControl(null, {
        validators: [Validators.required],
      }),
      postalCode: new FormControl(null, {
        validators: [Validators.required],
      }),
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
          size: cartItems[index].size,
          price: cartItems[index].productId.amount,
        });

        const itemAmount =
          cartItems[index].quantity * cartItems[index].productId.amount;
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
    const streetAddressLineOne = this.ShippingBillingForm.value
      .streetAddressLineOne;
    const streetAddressLineTwo = this.ShippingBillingForm.value
      .streetAddressLineTwo;
    const province = this.ShippingBillingForm.value.province;
    const country = this.ShippingBillingForm.value.country;
    const city = this.ShippingBillingForm.value.city;
    const zipCode = this.ShippingBillingForm.value.postalCode;

    this.orderDetails.fullName = fullName;
    this.orderDetails.phoneNumber = phoneNumber;
    this.orderDetails.emailAddress = email;

    this.orderDetails.city = city;
    this.orderDetails.country = country;
    this.orderDetails.zipCode = zipCode;
    this.orderDetails.streetAddressLineOne = streetAddressLineOne;
    this.orderDetails.streetAddressLineTwo = streetAddressLineTwo;
    this.orderDetails.province = province;
    const orderTotal = (this.orderTotal / this.xRate).toFixed();
    // console.log(fx.convert(this.orderTotal, {from: 'ZAR', to: 'USD'}))
    // const orderTotal = (this.orderTotal / this.xRate).toFixed;
    console.log(orderTotal)
    paypal
      .Buttons({
        enableStandardCardFields: false,
        createOrder(data, actions) {
          return actions.order.create({
            intent: 'CAPTURE',
            payer: {
              name: {
                given_name: fullName.split(' ').slice(0, -1).join(' '),
                surname: fullName.split(' ').slice(-1).join(' '),
              },
              address: {
                address_line_1: streetAddressLineOne,
                address_line_2: streetAddressLineTwo,
                admin_area_2: city,
                admin_area_1: province,
                postal_code: zipCode,
                country_code: 'ZA',
              },
              email_address: email,
              phone: {
                phone_type: 'MOBILE',
                phone_number: {
                  national_number: phoneNumber,
                },
              },
            },
            purchase_units: [
              {
                amount: {
                  value: orderTotal, // need to duncamically add exchange rate
                  currency_code: 'USD',
                },
                shipping: {
                  address: {
                    address_line_1: streetAddressLineOne,
                    address_line_2: streetAddressLineTwo,
                    admin_area_2: city,
                    admin_area_1: province,
                    postal_code: zipCode,
                    country_code: 'ZA',
                  },
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.dialogRef.close();
          this.shopService.toggleSideNav();
          this.shopService.updateCart.next();
          this.router.navigate(['/home']);
          this.shopService.createOrder(order)
          .subscribe(response => {
        }, err => console.log(err));
        },
        onError: ((err) => {
          console.log(err);
        })
      })
      .render(this.paypalElement.nativeElement);
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
    userId: string;
  };
  size: string;
  quantity: number;
}
interface Order {
  fullName: string;
  phoneNumber: number;
  emailAddress: string;
  streetAddressLineOne: string;
  streetAddressLineTwo: string;
  province: string;
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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  ShippingBillingForm: FormGroup;
  shippingDetails;
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
  constructor(private authService: AuthService) { }

  ngOnInit() {

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
    this.getShippingDetails();

  }

  getShippingDetails(){

    return new Promise((resolve, reject) =>  {
      this.authService.getUser(this.authService.getUserId()).subscribe(userData => {

        resolve(  userData.user.shippingDetails);
      });
    }).then((shippingDetails:any)=> {
      console.log(shippingDetails)
      this.ShippingBillingForm.setValue({
        streetAddressLineOne: shippingDetails.streetAddressLineOne,
        streetAddressLineTwo: shippingDetails.streetAddressLineOne,
        province: shippingDetails.province,
        country: shippingDetails.country,
        city: shippingDetails.city,
        postalCode: shippingDetails.zipCode,
      });
    });
  }
  onSaveShippingDetails(){
    this.authService.updateShippingDetails(this.ShippingBillingForm.value)
    .subscribe(response => {
      console.log(response)
    })
  }
}

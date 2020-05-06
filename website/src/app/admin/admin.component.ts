import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { mimeType } from './add-product/mime-type.validator';
import { AdminService } from '../services/admin.service';
import { Product } from '../models/product.model';
import { map } from 'rxjs/internal/operators/map';
import { Order } from '../models/order.model';

export interface AlertData {
  prodId: string;
  productName: string;
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  bgColor = "#29524A"
  links = [
    {label: 'dashboard', path: 'dashboard'},
    {label: 'Products', path: 'all-products'},
    {label: 'Orders', path: 'orders'},
  ];


  constructor() {}

  ngOnInit() {

  }

}

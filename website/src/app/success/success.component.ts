import { Component, OnInit, Inject } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {message:string}
  ) { }


  ngOnInit(){

  }

}

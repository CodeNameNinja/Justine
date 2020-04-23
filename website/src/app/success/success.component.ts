import { Component, OnInit } from '@angular/core';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(
    public shopService: ShopService
  ) { }

  ngOnInit() {
    // setTimeout(()=> {
    //   this.shopService.toggleSuccessMessage();
    // },5000);
  }

}

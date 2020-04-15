import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
@Output() openCartEmitter = new EventEmitter<any>();
  constructor(
    public shopService: ShopService
  ) { }

  ngOnInit() {
  }

  openCart(){
    this.openCartEmitter.emit();
  }
}

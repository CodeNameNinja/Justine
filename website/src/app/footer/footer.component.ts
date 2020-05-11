import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private shopService: ShopService
  ) { }

  ngOnInit() {
  }

  filter(category:string){

    this.shopService.filterCategories.next(category);
  }

  onLogout() {
    this.authService.logout();
  }

}

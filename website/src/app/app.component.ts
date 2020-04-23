import { Component, EventEmitter, Output } from '@angular/core';
import { ShopService } from './services/shop.service';
import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    public shopService: ShopService
  ){
    this.authService.autoAuthUser();
  }

  title = 'website';

}

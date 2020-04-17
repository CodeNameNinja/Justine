import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
@Output() openCartEmitter = new EventEmitter<any>();

userIsAuthenticated = false;
private authListenerSubs: Subscription;
  constructor(
    public shopService: ShopService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }


  openCart(){
    this.openCartEmitter.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}

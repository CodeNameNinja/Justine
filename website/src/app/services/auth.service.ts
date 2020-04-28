import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from '../models/auth-data.model';
import { environment } from 'src/environments/environment';
import { ShopService } from './shop.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private adminIsAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  public name: string;
  public email: string;
  public phoneNumber: string;
  private authStatusListener = new Subject<boolean>();
  private shippinggDetails;
  constructor(private http: HttpClient, private router: Router,
    private shopService: ShopService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getIsAdminAuth() {
    // console.log(this.adminIsAuthenticated)
    return this.adminIsAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  createUser(firstName: string, lastName: string, email: string, password: string) {
    const authData: AuthData = { firstName, lastName, email, password };
    return this.http
      .post(`${environment.apiUrl}/user/signup`, authData)
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password };
    this.http
      .post<{ token: string; expiresIn: number, userId: string, name: string, email: string, phoneNumber: string  }>(
        `${environment.apiUrl}/user/login`,
        authData
      )
      .subscribe(response => {
        // console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.name = response.name;
          this.email = response.email;
          this.phoneNumber = response.phoneNumber;
          if (response.email === 'jmallandain@gmail.com') {
            this.adminIsAuthenticated = true;
          }
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          // console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, this.name, this.email, this.phoneNumber);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;

      this.userId = authInformation.userId;
      this.name = authInformation.name;
      this.email = authInformation.email;
      this.phoneNumber = authInformation.phoneNumber;
      if (authInformation.email === 'jmallandain@gmail.com') {
        this.adminIsAuthenticated = true;
      }
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);

    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.adminIsAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.shopService.closeSideNav();
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    console.log('logged out');
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    // console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, name: string, email: string, phoneNumber: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('phoneNumber', phoneNumber);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('phoneNumber');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      name,
      email,
      phoneNumber
    };
  }



  // Resetting Password;

  postReset(email) {
    this.http.post(`${environment.apiUrl}/user/reset`, {email})
    .subscribe(response => {
      this.router.navigate(['/login']);
      // console.log(response);
    }, err => {
      console.log(err);
    });
  }
  getNewPassword(token) {
    return this.http.get(`${environment.apiUrl}/user/reset/${token}`);
  }
  postNewPassword(userId, passwordToken, password) {
    this.http.post(`${environment.apiUrl}/user/new-password`, {userId, passwordToken, password})
    .subscribe(response => {
      this.router.navigate(['/login']);
      // console.log(response);
    }, err => {
      console.log(err);
    });
  }

  getUser(userId) {
    return this.http.get<{message:string, user: any}>(`${environment.apiUrl}/user/${userId}`);
  }

  updateUser(userData){
    return this.http.post(`${environment.apiUrl}/user/update`, userData);
  }
  updateEmail(emailData){
    return this.http.post(`${environment.apiUrl}/user/update/email`, emailData);
  }
  updateShippingDetails(shippingDetails){
    return this.http.post(`${environment.apiUrl}/user/update/shipping-details`, shippingDetails);
  }
}

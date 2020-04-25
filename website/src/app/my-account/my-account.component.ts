import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  isLoading = false;
  id: string;
  user: any;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      this.id = params["userId"];
      this.authService.getUser(this.id)
     .subscribe(userData => {
       this.user = userData.user;
       this.isLoading = false;
       console.log(this.user)
     })
    });
  }

}

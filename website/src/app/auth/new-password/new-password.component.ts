import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  userId;
  passwordToken;
  constructor(
    private authService: AuthService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    const token = this.router.snapshot.paramMap.get('token');
    this.authService.getNewPassword(token)
    .subscribe((response: {userId: string, passwordToken: string}) => {
      this.userId = response.userId;
      this.passwordToken = response.passwordToken;
    }, err => {
      console.log(err);
    });
  }

  onChangePassword(form: NgForm) {
    this.authService.postNewPassword(this.userId,this.passwordToken,form.value.password)
  }

}

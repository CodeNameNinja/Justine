import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    console.log(form)
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.username, form.value.email, form.value.password);
  }
}

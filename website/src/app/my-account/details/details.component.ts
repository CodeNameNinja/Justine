import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewChecked {
  @ViewChild('f', { static: false }) detailsForm: NgForm;
  @ViewChild('emailForm', { static: false }) emailForm: NgForm;
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {

  }
  ngAfterViewChecked() {
    const firstName = this.authService.name.split(' ').slice(0, -1).join(' ');
    const lastName = this.authService.name.split(' ').slice(-1).join(' ');
    this.detailsForm.form.patchValue({
      firstName,
      lastName

    });
    if(this.authService.phoneNumber)
    {
      const phoneNumber = this.authService.phoneNumber;
      this.detailsForm.form.patchValue({
        phoneNumber
      });
    }

    const email = this.authService.email;
    this.emailForm.form.patchValue({
      email
    })
  }
  onSaveDetails() {
    // console.log(this.detailsForm.value);
    this.authService.updateUser(this.detailsForm.value).subscribe(res => {
      console.log(res);
    });
  }

  onSaveEmail(){
 this.authService.updateEmail(this.emailForm.value).subscribe((res) =>{
   console.log(res)
 })
  }

}

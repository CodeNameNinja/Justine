import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    this.http.post(`${environment.apiUrl}/email`,form.value).subscribe(response => {
      form.resetForm();
    })
  }

}

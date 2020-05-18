import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {message:string},
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<SuccessComponent>,
  ) { }


  ngOnInit(){

  }


  close(): void {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }
}

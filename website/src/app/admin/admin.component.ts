import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { mimeType } from './add-product/mime-type.validator';
import { AdminService } from '../services/admin.service';
import { Product } from '../models/product.model';
import { map } from 'rxjs/internal/operators/map';

export interface AlertData {
  prodId: string;
  productName: string;
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  constructor(
    public dialog: MatDialog,
    private adminService: AdminService
    ) {}
  animal: string;
  name: string;
  ngOnInit() {
    this.isLoading = true;
    this.adminService.getProducts()
    .pipe(
      map(productData => {
        return productData.products.map(product => {
          return {
            title: product.title,
            description: product.description,
            amount: product.amount,
            category: product.category,
            id: product._id,
            imageUrls: product.imageUrls
          };
        });
      })
    )
    .subscribe((transformedProducts: Product[]) => {
      this.products = transformedProducts.splice(0,3);
      this.isLoading = false;
    });
  }

  openDialog(product = null, mode = 'create') {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '50vw',
      data: {
        product
        , mode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }


  deleteProductAlert(id: any, product: any) {
    // console.log(id, ship);
    const prodId = id;
    const productName =  product;
    const dialogRef = this.dialog.open(DeleteProductAlert, {
      width: '250px',
      data: {prodId, productName }
    });

    const deleteProduct = (id: any) => {
      if (id !== undefined) {
        this.deleteProduct(id);
        // this.openSnackbar('ship Removed');
      }

    };

    dialogRef.afterClosed().subscribe(id => {
        // console.dir(id);
        deleteProduct(id);
    });
  }

  deleteProduct(id: string) {
    this.isLoading = true;
    // console.log(id);
    this.adminService.postDeleteProduct(id)
    .subscribe(res => {
      console.log(res);
      this.adminService.getProducts();
      this.isLoading = false;
    });
  }

}

export interface DialogData {
  product: Product;
  mode: string;
}
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product/add-product.component.html',
  styleUrls: ['./add-product/add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  myImages = [];
  isLoading = false;
  imagePreview = [];
  private mode = 'create';
  private productId: string;
  addProductForm: FormGroup;
  product: { title: any; description: any; amount: any; category: any; imageUrls: any; id?: string; };

  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog) {

    }

  ngOnInit() {

    this.addProductForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      amount: new FormControl(null, {
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl('', {
        validators: [Validators.required],
        // asyncValidators: [mimeType]
      })
    });


    if (this.data.mode === 'edit') {
      this.mode = 'edit';
      // this.imagePreview = this.data.product.imageUrls;
      this.product = {
        id: this.data.product.id,
        title:  this.data.product.title,
        description:  this.data.product.description,
        amount:  this.data.product.amount,
        category:  this.data.product.category,
        imageUrls:  this.data.product.imageUrls
      };
      this.addProductForm.setValue({
      title:  this.product.title,
        description:  this.product.description,
        amount:  this.product.amount,
        category:  this.product.category,
        image:  this.product.imageUrls
      });
      // console.log("urls",this.data.product.imageUrls)
      for (const imageUrl of this.data.product.imageUrls) {
        this.myImages.push(imageUrl);
      }
      for (const imageUrl of this.data.product.imageUrls) {
        this.imagePreview.push(imageUrl);
      }


    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onImagePicked(event: { target: { files: string | any[]; }; }) {

    const filesAmount = event.target.files.length;
    for (const file of event.target.files) {
            const reader = new FileReader();
            this.myImages.push(file);
            this.addProductForm.patchValue({
              image: this.myImages
           });
            // this.addProductForm.get('image').updateValueAndValidity();
            reader.onload = () => {
              this.imagePreview.push(reader.result as String);
            };
            reader.readAsDataURL(file);
          }
    console.log('this.myImages', this.myImages);
    console.log('this.imagePreview', this.imagePreview);
    console.log(this.imagePreview.length);

  }


  onSubmit() {
    console.log(this.addProductForm.value);
    const productData = new FormData();
    const title = this.addProductForm.value.title;
    const description = this.addProductForm.value.description;
    const amount = this.addProductForm.value.amount;
    const category = this.addProductForm.value.category;
    productData.append('title', title);
    productData.append('description', description);
    productData.append('amount', amount);
    productData.append('category', category);


    for (const image of this.myImages) {
      console.log('image', image);
      if (typeof image === 'object') {
        productData.append('images[]', image, title);
        // console.log("image",image)
      } else {
        productData.append('imageUrls[]', image);
      }
    }

    if (this.addProductForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.adminService.addProduct(productData);
      // console.log('create', productData.toString());
    }
    if (this.mode === 'edit') {
      this.isLoading = true;
      console.log('edit', productData.get('imageUrls'));
      this.adminService.updateProduct(
        this.data.product.id,
        productData
      ).subscribe(responseData => {
        console.log(responseData);
        this.adminService.getProducts();
        this.isLoading = false;
      }); ;
    }
    this.addProductForm.reset();
  }



  }

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product/delete-product.component.html',
})
export class DeleteProductAlert {

  constructor(
    public dialogRef: MatDialogRef<DeleteProductAlert>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData,
     ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
interface Image {
  image: string;
}

import { Component, OnInit, Inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { Order } from 'src/app/models/order.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/services/admin.service';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertData } from '../admin.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  isLoading = false;
  constructor(public dialog: MatDialog, private adminService: AdminService) {}

  ngOnInit() {
    this.getAllOrders();
    this.isLoading = true;
    this.getProducts();
  }
  async getProducts() {
    await this.adminService.getProducts();
    await this.adminService
      .getProductUpdateListener()
      .subscribe((productData: {products: Product[]}) => {
        const productArray = productData.products.slice();
        this.products = productArray.splice(0, 3);
        this.isLoading = false;
        // console.log(this.products);
      });
  }
  openProductDialog(product = null, mode = 'create') {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: 'calc(500px + (750 - 500) * ((100vw - 300px) / (1600 - 300)))',
      maxWidth: '100vw !important',
      data: {
        product,
        mode,
      },
    });
  }

  deleteProductAlert(id: any, product: any) {
    const prodId = id;
    const productName = product;
    const dialogRef = this.dialog.open(DeleteProductAlert, {
      width: '250px',
      data: { prodId, productName },
    });

    const deleteProduct = (id: any) => {
      if (id !== undefined) {
        this.isLoading = true;
        this.adminService.postDeleteProduct(id).subscribe((res) => {
      this.adminService.getProducts();
      this.isLoading = false;
    });
      }
    };

    dialogRef.afterClosed().subscribe((id: any) => {
      deleteProduct(id);
    });
  }

  getAllOrders() {
    this.isLoading = true;
    this.adminService
      .getAllOrders()
      .subscribe(
        (transformedOrders) => {
          this.orders = transformedOrders.orders.splice(0, 3);
          this.isLoading = false;
        },
        (err) => console.log(err)
      );
  }
}

export interface DialogData {
  product: Product;
  mode: string;
}
@Component({
  selector: 'app-add-product',
  templateUrl: '../add-product/add-product.component.html',
  styleUrls: ['../add-product/add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  myImages = [];
  isLoading = false;
  imagePreview = [];
  private mode = 'create';
  addProductForm: FormGroup;
  product: Product;

  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.addProductForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      amount: new FormControl(null, {
        validators: [Validators.required],
      }),
      discount: new FormControl(0, {
      }),
      category: new FormControl(null, {
        validators: [Validators.required],
      }),
      sizes: new FormGroup({
        small: new FormControl(null, {
          validators: [Validators.required],
        }),
        medium: new FormControl(null, {
          validators: [Validators.required],
        }),
        large: new FormControl(null, {
          validators: [Validators.required],
        }),
        xLarge: new FormControl(null, {
          validators: [Validators.required],
        }),
      }),
      image: new FormControl('', {
        validators: [Validators.required],
        // asyncValidators: [mimeType]
      }),
    });

    if (this.data.mode === 'edit') {
      this.mode = 'edit';

      let sizes = this.data.product.sizes;
      if(Array.isArray(sizes)){
        sizes = sizes.reduce((obj, item) => (obj[item.size] = item.quantity, obj) , {});
      }

      this.product = {
        id: this.data.product.id,
        title: this.data.product.title,
        description: this.data.product.description,
        amount: this.data.product.amount,
        discount: this.data.product.discount,
        category: this.data.product.category,
        sizes,
        imageUrls: this.data.product.imageUrls,
      };
      this.addProductForm.setValue({
        title: this.product.title,
        description: this.product.description,
        amount: this.product.amount,
        discount: this.product.discount,
        category: this.product.category,
        sizes: {
          small: this.product.sizes.small,
          medium: this.product.sizes.medium,
          large: this.product.sizes.large,
          xLarge: this.product.sizes.xLarge,
        },
        image: this.product.imageUrls,
      });
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

  onImagePicked(event: { target: { files: string | any[] } }) {
    const filesAmount = event.target.files.length;
    for (const file of event.target.files) {
      const reader = new FileReader();
      this.myImages.push(file);
      this.addProductForm.patchValue({
        image: this.myImages,
      });
      reader.onload = () => {
        this.imagePreview.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    const productData = new FormData();
    const title = this.addProductForm.value.title;
    const description = this.addProductForm.value.description;
    const amount = this.addProductForm.value.amount;
    const discount = this.addProductForm.value.discount;
    const category = this.addProductForm.value.category;
    const sizes = this.addProductForm.value.sizes;

    productData.append('title', title);
    productData.append('description', description);
    productData.append('amount', amount);
    productData.append('discount', discount);
    productData.append('category', category);
    productData.append('sizes', JSON.stringify(sizes));

    for (const image of this.myImages) {
      if (typeof image === 'object') {
        productData.append('images[]', image, title);
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
    }
    if (this.mode === 'edit') {
      this.isLoading = true;

      this.adminService
        .updateProduct(this.data.product.id, productData)
        .subscribe((responseData) => {
          this.adminService.getProducts();
          this.isLoading = false;
        });
    }
    this.addProductForm.reset();
  }
}

@Component({
  selector: 'app-delete-product',
  templateUrl: '../delete-product/delete-product.component.html',
})
export class DeleteProductAlert {
  constructor(
    public dialogRef: MatDialogRef<DeleteProductAlert>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

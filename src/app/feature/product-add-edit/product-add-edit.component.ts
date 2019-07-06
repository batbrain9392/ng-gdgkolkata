import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/interfaces/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-add-edit',
  templateUrl: './product-add-edit.component.html',
  styleUrls: ['./product-add-edit.component.scss']
})
export class ProductAddEditComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  productId: string;
  file: File;
  fileUrl: string;
  subscription: Subscription;

  constructor(
    fb: FormBuilder,
    activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private matSnackBar: MatSnackBar
  ) {
    this.productId = activatedRoute.snapshot.params.id;
    this.productForm = fb.group({
      // name: [null, Validators.required],
      // price: [null, Validators.required],
      // description: [null, Validators.required]
      name: ['Product', Validators.required],
      price: [10, Validators.required],
      description: ['Description', Validators.required]
    });
  }
  get name() {
    return this.productForm.controls.name as FormControl;
  }
  get price() {
    return this.productForm.controls.price as FormControl;
  }
  get description() {
    return this.productForm.controls.description as FormControl;
  }

  ngOnInit() {
    if (this.productId) {
      this.subscription = this.productService
        .getProduct(this.productId)
        .subscribe(product => {
          if (product) {
            this.productForm.setValue({
              name: product.name,
              price: product.price,
              description: product.description
            });
            if (product.fileUrl) {
              this.fileUrl = product.fileUrl.medium;
            }
          } else {
            this.router.navigate(['feature', 'products']);
            this.matSnackBar.open('Item does not exist');
          }
        });
    }
  }

  setFile(file: File) {
    this.file = file;
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.productId) {
        this.productService
          .updateProduct({
            id: this.productId,
            ...this.productForm.value
          } as Product)
          .then(() => {
            this.router.navigate(['feature', 'products', this.productId]);
            this.matSnackBar.open('Item updated');
          });
      } else {
        this.productService
          .addProduct(this.file, this.productForm.value as Product)
          .then(({ doc, task$ }) =>
            task$.subscribe(console.log, console.log, () => {
              this.productForm.reset();
              this.router.navigate(['feature', 'products']);
              this.matSnackBar
                .open('Item created', 'VIEW')
                .onAction()
                .subscribe(() =>
                  this.router.navigate(['feature', 'products', doc.id])
                );
            })
          );
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

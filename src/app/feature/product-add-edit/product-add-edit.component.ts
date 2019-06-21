import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-product-add-edit',
  templateUrl: './product-add-edit.component.html',
  styleUrls: ['./product-add-edit.component.scss']
})
export class ProductAddEditComponent implements OnInit {
  productForm: FormGroup;
  productId: string;
  file: File;
  fileUrl: string;

  constructor(
    fb: FormBuilder,
    activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productId = activatedRoute.snapshot.params.id;
    this.productForm = fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required]
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
      this.productService
        .getProduct(this.productId)
        .subscribe(product => {
          this.fileUrl = product.fileUrl.medium;
          this.productForm.setValue({
            name: product.name,
            price: product.price,
            description: product.description
          });
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
          .then(console.log);
      } else {
        this.productService
          .addProduct(this.file, this.productForm.value as Product)
          .then(() => {
            this.productForm.reset();
            this.router.navigate(['feature', 'products']);
          });
      }
    }
  }
}

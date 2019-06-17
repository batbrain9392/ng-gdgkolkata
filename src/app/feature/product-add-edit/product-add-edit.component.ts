import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    fb: FormBuilder,
    activatedRoute: ActivatedRoute,
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
    return this.productForm.controls.name;
  }
  get price() {
    return this.productForm.controls.price;
  }
  get description() {
    return this.productForm.controls.description;
  }

  ngOnInit() {
    this.productService
      .getProduct(this.productId)
      .subscribe(product => this.productForm.setValue(product));
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.productId) {
        this.productService.updateProduct({
          id: this.productId,
          ...this.productForm.value
        } as Product)
        .then(console.log);
      } else {
        this.productService
          .addProduct(this.productForm.value as Product)
          .then(doc => {
            console.log(doc.id);
            this.productForm.reset();
          });
      }
    }
  }
}

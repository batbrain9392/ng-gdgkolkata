import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  subscription: Subscription;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.params.id;
    this.subscription = this.productService.getProduct(productId)
      .subscribe(product => {
        if (product) {
          this.product = product;
        } else {
          this.router.navigate(['feature', 'products']);
          this.matSnackBar.open('Item does not exist');
        }
      });
  }

  onDelete(productId: string) {
    this.subscription.unsubscribe();
    this.productService.deleteProduct(productId)
      .then(() => {
        this.router.navigate(['feature', 'products']);
        this.matSnackBar.open('Item deleted');
      });
  }
}

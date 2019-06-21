import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product>;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.params.id;
    this.product$ = this.productService.getProduct(productId);
  }

  onDelete(productId: string) {
    this.productService.deleteProduct(productId)
      .then(() => {
        this.router.navigate(['feature', 'products']);
        this.matSnackBar.open('Item deleted');
      });
  }
}

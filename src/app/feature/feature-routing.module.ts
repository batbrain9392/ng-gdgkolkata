import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductAddEditComponent } from './product-add-edit/product-add-edit.component';

const routes: Routes = [
  {
    path: 'products',
    children: [
      { path: 'add', component: ProductAddEditComponent },
      { path: 'edit/:id', component: ProductAddEditComponent },
      { path: ':id', component: ProductDetailsComponent },
      { path: '', component: ProductListComponent }
    ]
  },
  { path: '', redirectTo: 'products' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }

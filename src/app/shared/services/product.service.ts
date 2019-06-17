import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsCollection: AngularFirestoreCollection<Product>;

  constructor(afs: AngularFirestore) {
    this.productsCollection = afs
      .collection(environment.firebaseEnv.app)
      .doc(environment.firebaseEnv.env)
      .collection<Product>('products');
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data } as Product;
      }))
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.productsCollection.doc(id).valueChanges() as Observable<Product>;
  }

  addProduct(product: Product) {
    return this.productsCollection.add(product);
  }
}

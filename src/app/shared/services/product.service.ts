import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Product, FileUrl } from '../interfaces/product';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private collectionName = 'products';
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(afs: AngularFirestore, private fileService: FileService) {
    this.productsCollection = afs
      .doc(environment.env)
      .collection<Product>(this.collectionName);
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          if (data) {
            return { id, ...data } as Product;
          }
          return null;
        })
      )
    );
  }

  getProduct(productId: string): Observable<Product> {
    return this.productsCollection
      .doc(productId)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data();
          const id = action.payload.id;
          if (data) {
            return { id, ...data } as Product;
          }
          return null;
        })
      ) as Observable<Product>;
  }

  async addProduct(
    file: File,
    product: Product
  ): Promise<{
    doc: firebase.firestore.DocumentReference;
    task$: Observable<number>;
  }> {
    const doc = await this.productsCollection.add(product);
    let task$: Observable<number>;
    if (file) {
      task$ = this.uploadFileAndUpdateUrl(doc, file, product);
    }
    return { doc, task$ };
  }

  private uploadFileAndUpdateUrl(
    doc: DocumentReference,
    file: File,
    product: Product
  ): Observable<number> {
    product.id = doc.id;
    const { ref, task } = this.fileService.upload(file);
    return task.percentageChanges().pipe(
      finalize(async () => {
        const downloadURL = (await ref.getDownloadURL().toPromise()) as string;
        const metaData = await ref.getMetadata().toPromise();
        this.fileService
          .generateThumbs(doc.id, metaData, downloadURL)
          .subscribe();
      })
    );
  }

  updateProduct({ id, ...productRest }: Product): Promise<void> {
    return this.productsCollection.doc(id).update(productRest);
  }

  deleteProduct(id: string): Promise<void> {
    return this.productsCollection.doc(id).delete();
  }
}

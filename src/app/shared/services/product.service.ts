import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Product, FileUrl } from '../interfaces/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsCollection: AngularFirestoreCollection<Product>;

  constructor(afs: AngularFirestore, private fileService: FileService) {
    this.productsCollection = afs
      .doc(environment.env)
      .collection<Product>('products');
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            if (data) {
              return { id, ...data } as Product;
            }
            return null;
          })));
  }

  getProduct(productId: string): Observable<Product> {
    return this.productsCollection.doc(productId)
      .snapshotChanges()
      .pipe(
        map(action => {
            const data = action.payload.data();
            const id = action.payload.id;
            if (data) {
              return { id, ...data } as Product;
            }
            return null;
          })) as Observable<Product>;
  }

  addProduct(file: File, product: Product): Promise<DocumentReference> {
    return this.productsCollection
      .add(product)
      .then(doc => {
        if (file) {
          this.uploadFileAndUpdateUrl(doc, file, product);
        }
        return doc;
      });
  }

  private uploadFileAndUpdateUrl(
    doc: DocumentReference,
    file: File,
    product: Product
  ): void {
    product.id = doc.id;
    const { ref, task } = this.fileService.upload(file);
    task
      .snapshotChanges()
      .subscribe(
        console.log, // Every upload value
        console.log, // Error
        async () => { // On completion
          const url = await ref.getDownloadURL().toPromise() as string;
          product.fileUrl = this.generateDownloadUrls(url);
          this.updateProduct(product);
        });
  }

  private generateDownloadUrls(url: string): FileUrl {
    const size = {
      medium: 256,
      small: 64
    };
    const delim = {
      queryParam: '?',
      folder: '%2F'
    };
    const [uri, queryParams] = url.split(delim.queryParam);
    const [remainingUri, fileName] = uri.split(delim.folder);
    const fileUrl: FileUrl = {
      original: fileName,
      medium: `thumb@${size.medium}@${fileName}`,
      small: `thumb@${size.small}@${fileName}`,
    };
    for (const key in fileUrl) {
      if (fileUrl.hasOwnProperty(key)) {
        fileUrl[key] = [remainingUri, fileUrl[key]].join(delim.folder);
        fileUrl[key] = [fileUrl[key], queryParams].join(delim.queryParam);
      }
    }
    return fileUrl;
  }

  updateProduct({ id, ...productRest }: Product): Promise<void> {
    return this.productsCollection.doc(id).update(productRest);
  }

  deleteProduct(id: string): Promise<void> {
    return this.productsCollection.doc(id).delete();
  }
}

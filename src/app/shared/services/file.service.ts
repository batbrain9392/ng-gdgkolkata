import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(
    private storage: AngularFireStorage,
    private functions: AngularFireFunctions
  ) {}

  upload(file: File) {
    const fileName = `${Date.now()}_${file.name}`;
    const path = `${fileName}/${fileName}`;
    const ref = this.storage.ref(path);
    const task = this.storage.upload(path, file);
    return { ref, task };
  }

  generateThumbs(productId: string, metaData: any, downloadURL: string) {
    const callable = this.functions.httpsCallable('generateThumbsOnCall');
    return callable({ productId, metaData, downloadURL });
  }
}

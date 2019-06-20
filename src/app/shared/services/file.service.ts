import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private storage: AngularFireStorage) {}

  upload(file: File) {
    const fileName = `${Date.now()}_${file.name}`;
    const path = `${fileName}/${fileName}`;
    const ref = this.storage.ref(path);
    const task = this.storage.upload(path, file);
    return { ref, task };
  }
}

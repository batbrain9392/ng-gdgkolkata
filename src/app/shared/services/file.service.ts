import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { FileUrl } from '../interfaces/product';

interface UploadTasks {
  path: string;
  task: AngularFireUploadTask;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(
    private storage: AngularFireStorage,
    private functions: AngularFireFunctions
  ) {}

  upload(file: File): UploadTasks {
    const fileName = `${Date.now()}_${file.name}`;
    const path = `${fileName}/${fileName}`;
    const task = this.storage.upload(path, file);
    return { path, task };
  }

  generateThumbs(fullPath: string): Observable<FileUrl> {
    const callable = this.functions.httpsCallable('generateThumbs');
    return callable(fullPath);
  }

  ref(path: string): AngularFireStorageReference {
    return this.storage.ref(path);
  }
}

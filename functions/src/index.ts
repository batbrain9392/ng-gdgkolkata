import { https, firestore } from 'firebase-functions';
import { initializeApp, storage } from 'firebase-admin';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

initializeApp();
const fbStorage = storage();

interface FileUrl {
  original: string;
  size256: string;
  size64: string;
}

export const generateThumbs = https.onCall(
  async (fullPath: string, context) => {
    const bucket = fbStorage.bucket();
    const bucketDir = dirname(fullPath);
    const workingDir = join(tmpdir(), 'thumbs');
    await fs.ensureDir(workingDir);
    const fileName = fullPath.split('/').pop();
    if (fileName) {
      const tmpFilePath = join(workingDir, fileName);
      await bucket.file(fullPath).download({
        destination: tmpFilePath
      });
      const fileUrl: FileUrl = {
        size64: '',
        size256: '',
        original: fullPath
      };
      const sizes = [64, 256];
      const uploadPromises = sizes.map(async (size, index) => {
        const thumbName = `thumb@${size}@${fileName}`;
        const thumbPath = join(workingDir, thumbName);
        await sharp(tmpFilePath)
          .resize(size, size)
          .toFile(thumbPath);
        const destination = join(bucketDir, thumbName);
        switch (index) {
          case 0:
            fileUrl.size64 = destination;
            break;
          case 1:
            fileUrl.size256 = destination;
            break;
          default:
            break;
        }
        return bucket.upload(thumbPath, { destination: destination });
      });
      await Promise.all(uploadPromises);
      await fs.remove(workingDir);
      console.log(fileUrl);
      return fileUrl;
    }
    return null;
  }
);

export const deleteImageFolder = firestore
  .document('app/dev/products/{productId}')
  .onDelete((snap, context) => {
    const fileUrl: FileUrl = snap.get('fileUrl');
    if (fileUrl) {
      const delim = {
        queryParam: '?',
        folder: '%2F'
      };
      const uri = fileUrl.original.split(delim.queryParam).shift();
      if (uri) {
        const folder = uri.split(delim.folder).pop();
        if (folder) {
          const bucket = fbStorage.bucket();
          return bucket
            .deleteFiles({
              prefix: `${folder}/`
            })
            .then(() => console.log(`${folder} folder deleted`));
        }
      }
    }
    return false;
  });

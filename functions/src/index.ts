import * as functions from 'firebase-functions';
import { initializeApp, firestore, storage } from 'firebase-admin';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

initializeApp();
const fbStorage = storage();
const fbFirestore = firestore();

interface FileUrl {
  original: string;
  medium: string;
  small: string;
}

export const generateThumbsOnCall = functions.https.onCall(
  async ({ productId, metaData, downloadURL }, context) => {
    const bucket = fbStorage.bucket(metaData.bucket);
    const bucketDir = dirname(metaData.fullPath);
    const workingDir = join(tmpdir(), 'thumbs');
    await fs.ensureDir(workingDir);
    const fileName = metaData.fullPath.split('/').pop();
    const tmpFilePath = join(workingDir, fileName);
    const file = bucket.file(metaData.fullPath);
    await file.download({
      destination: tmpFilePath
    });
    const fileUrl: FileUrl = {
      small: '',
      medium: '',
      original: downloadURL
    };
    const sizes = [64, 256];
    const uploadPromises = sizes.map(async size => {
      const thumbName = `thumb@${size}@${fileName}`;
      const thumbPath = join(workingDir, thumbName);
      await sharp(tmpFilePath)
        .resize(size, size)
        .toFile(thumbPath);
      return bucket.upload(thumbPath, {
        destination: join(bucketDir, thumbName)
      });
    });
    await Promise.all(uploadPromises).then(() =>
      console.log(sizes, 'generated')
    );
    // Set download urls for the newly generated sizes
    // fileUrl.small = downloadUrl;
    // fileUrl.medium = downloadUrl;
    await fs.remove(workingDir);
    return fbFirestore
      .doc(`app/dev/products/${productId}`)
      .update({ fileUrl: fileUrl })
      .then(() => console.log(`${productId} updated`));
  }
);

export const deleteImageFolder = functions.firestore
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

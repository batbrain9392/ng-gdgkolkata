import * as functions from 'firebase-functions';
import { initializeApp, storage } from 'firebase-admin';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

initializeApp();
const firebaseStorage = storage();

export const generateThumbs = functions.storage
  .object()
  .onFinalize(async object => {
    const bucket = firebaseStorage.bucket(object.bucket);
    const filePath = object.name;
    if (filePath) {
      const bucketDir = dirname(filePath);
      const workingDir = join(tmpdir(), 'thumbs');
      const fileName = filePath.split('/').pop();
      if (fileName) {
        const tmpFilePath = join(workingDir, fileName);

        if (
          fileName.includes('thumb@') ||
          (object.contentType && !object.contentType.includes('image'))
        ) {
          console.log('fileName', fileName, 'object.contentType', object.contentType, 'exiting function');
          return false;
        }

        // 1. Ensure thumbnail dir exists
        await fs.ensureDir(workingDir);

        // 2. Download Source File
        await bucket.file(filePath).download({
          destination: tmpFilePath
        });

        // 3. Resize the images and define an array of upload promises
        const sizes = [32, 256];

        const uploadPromises = sizes.map(async size => {
          const thumbName = `thumb@${size}@${fileName}`;
          const thumbPath = join(workingDir, thumbName);

          // Resize source image
          await sharp(tmpFilePath)
            .resize(size, size)
            .toFile(thumbPath);

          // Upload to firebaseStorage
          return bucket.upload(thumbPath, {
            destination: join(bucketDir, thumbName)
          });
        });

        // 4. Run the upload operations
        await Promise.all(uploadPromises);

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(workingDir);
      }
      console.log('filename not found, exiting function');
      return false;
    }
    console.log('filepath not found, exiting function');
    return false;
  });

export interface FileUrl {
  original: string;
  medium: string;
  small: string;
}
export const deleteImageFolder = functions.firestore
  .document('app/dev/products/{productId}')
  .onDelete((snap, context) => {
    // Get an object representing the document prior to deletion
    const fileUrl: FileUrl = snap.get('fileUrl');
    if (fileUrl) {
      const delim = {
        queryParam: '?',
        folder: '%2F'
      };
      const uri = fileUrl.original.split(delim.queryParam).shift();
      if (uri) {
        const folder = uri.split(delim.folder).pop();
        console.log(folder);
        if (folder) {
          const bucket = firebaseStorage.bucket();
          return bucket.deleteFiles({
            prefix: `${folder}/`
          })
          .then(() => console.log(`${folder} folder deleted`));
        } else {
          console.log('folder not found');
        }
      } else {
        console.log('uri not found');
      }
    } else {
      console.log('fileUrl not found');
    }
    return false;
  });

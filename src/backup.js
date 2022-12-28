import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'fs';
import { join } from 'path';
import { $ } from 'zx';
import config from './config.js';
import s3Client from './s3-client.js';
import { withTemporaryDir } from './tmp.js';
import { getAllFilesInS3 } from './bucket.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export default async function backup() {
  withTemporaryDir(async (name) => {
    const fileName = '' + new Date().getTime();
    const filePath = join(name, fileName);
    console.log('Creating backup at', filePath);

    await $`mongodump -vvvvv --gzip --archive=${filePath} ${config.mongoUri}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.s3Bucket,
        Key: `${config.s3Location}/${fileName}`,
        Body: createReadStream(filePath),
      },
    });

    await upload.done();
    await removeOldBackups();
  });
}

async function removeOldBackups() {
  const files = await getAllFilesInS3();
  const filesToRemove = files.slice(config.backupsToKeep);

  const result = await Promise.allSettled(
    filesToRemove.map((f) => s3Client.send(new DeleteObjectCommand({ Bucket: config.s3Bucket, Key: f.Key })))
  );
  console.log(
    'Deleted',
    result.filter((r) => r.status === 'fulfilled').length,
    'files,',
    result.filter((r) => r.status === 'rejected').length,
    'failed to remove'
  );
}

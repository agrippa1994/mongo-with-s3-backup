import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'fs';
import { join } from 'path';
import { $ } from 'zx';
import config from './config.js';
import s3Client from './s3-client.js';
import { withTemporaryDir } from './tmp.js';

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
  });
}

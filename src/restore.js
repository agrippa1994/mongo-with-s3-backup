import { GetObjectCommand } from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import inquirer from 'inquirer';
import { join } from 'path';
import { $ } from 'zx';
import { getAllFilesInS3 } from './bucket.js';
import config from './config.js';
import s3Client from './s3-client.js';
import { withTemporaryDir } from './tmp.js';

export default async function restore() {
  withTemporaryDir(async (name) => {
    const files = await getAllFilesInS3();

    const dateToBackup = await inquirer.prompt({
      name: 'data',
      message: 'Which backup to you want to restore?',
      type: 'list',
      choices: files.map((f) => ({
        name: f.LastModified?.toLocaleString() ?? f.Key,
        value: f,
      })),
    });

    const command = await s3Client.send(new GetObjectCommand({ Bucket: config.s3Bucket, Key: dateToBackup.data.Key }));

    const filePath = join(name, 'backup');
    const fileStream = createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      fileStream.on('error', reject);
      fileStream.on('finish', resolve);
      command.Body.pipe(fileStream);
    });
    await $`mongorestore --gzip --drop -vvvvv --archive=${filePath} ${config.mongoUri}`;
  });
}

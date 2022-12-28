import { paginateListObjectsV2 } from '@aws-sdk/client-s3';
import config from './config.js';
import s3Client from './s3-client.js';

export async function getAllFilesInS3() {
  const files = [];
  for await (const data of paginateListObjectsV2(
    { client: s3Client },
    { Bucket: config.s3Bucket, Prefix: config.s3Location }
  )) {
    files.push(...data.Contents.map((c) => c));
  }

  // sort descending
  files.sort((f1, f2) => f2.LastModified?.getTime() - f1.LastModified?.getTime());

  return files;
}

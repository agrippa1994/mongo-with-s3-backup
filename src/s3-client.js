import { S3Client } from '@aws-sdk/client-s3';
import config from './config.js';

export default new S3Client({
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
  region: config.awsRegion,
});

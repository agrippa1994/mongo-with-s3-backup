import { config as loadConfig } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  loadConfig();
}

const config = {
  mongoUri: process.env.MONGO_URI,
  s3Bucket: process.env.S3_BUCKET,
  s3Location: process.env.S3_LOCATION,
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  backupCron: process.env.BACKUP_CRON,
  backupsToKeep: Number(process.env.BACKUPS_TO_KEEP),
};

for (const [key, value] of Object.entries(config)) {
  if (!value) {
    throw new Error(`${key} has not any configured value`);
  }
}

if (isNaN(config.backupsToKeep)) {
  throw new Error('BACKUPS_TO_KEEP must be a number');
}

export default config;

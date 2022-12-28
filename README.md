# MongoDB Server with automatic backups

This repository provides a Docker Compose file that contains a MongoDB server and an automatic backup to S3 script with an interactive restoration
CLI.

Clone this repository and create a new `.env` file with following values:
```bash
MONGO_URI=mongodb://root:<your password>@localhost/
MONGO_PASSWORD=<your password>
S3_BUCKET=<name of S3 bucket>
S3_LOCATION=<directory within the S3 bucket>
AWS_REGION=<AWS region, e.g., eu-central-1>
AWS_ACCESS_KEY_ID=<AWS Access Key ID>
AWS_SECRET_ACCESS_KEY=<AWS Secret Access Key>
BACKUP_CRON=<Cron expression when backups are performed, e.g., "0 0 0 * * *">
BACKUPS_TO_KEEP=<number of backup to store at max>
```

Spin all up all docker containers using docker-compose:
```bash
docker-compose up --build -d
```

Create a new backup using docker-compose:
```bash
docker-compose exec backup mongo-backup-manager backup
```

Restore any backup using docker-compose, the latest backup is automatically preselected:
```bash
docker-compose exec backup mongo-backup-manager restore
```
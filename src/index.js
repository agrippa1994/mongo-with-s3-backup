#!/usr/bin/env node
import { program } from 'commander';
import { CronJob } from 'cron';
import backup from './backup.js';
import config from './config.js';
import restore from './restore.js';

program.name('mongo-backup-manager');
program.command('backup').action(async () => {
  await backup();
});

program.command('restore').action(async () => {
  await restore();
});

program.command('cron').action(async () => {
  const cron = new CronJob(config.backupCron, async () => {
    await backup();
  });
  cron.start();
});

program.parseAsync();

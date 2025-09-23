import { createWorker } from '../infrastructure/queue/bullmq';
import Logger from '../utils/logger';
import { User } from '../infrastructure/airtable/models';

type JobPayload = {
  userId: string;
  updateData: Record<string, any>;
};

async function processor(data: JobPayload) {
  try {
    await User.update(data.userId, data.updateData);
    Logger.info('airtableSync.worker', `Synced user ${data.userId} to Airtable`);
  } catch (err) {
    const message = err && (err as any).message ? (err as any).message : '';
    if (message.includes('Could not find') || message.includes('Could not find what you are looking for')) {
      Logger.warn('airtableSync.worker', `Airtable record not found for user ${data.userId}, discarding job`);
      return;
    }

    Logger.error('airtableSync.worker', `Failed to sync user ${data.userId}`, err);
    throw err;
  }
}

const worker = createWorker(processor, { concurrency: 2 });

worker.on('error', (err) => {
  Logger.error('airtableSync.worker', 'Worker fatal error', err);
});

export default worker;

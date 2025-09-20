import { Queue, Worker, JobsOptions } from 'bullmq';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
// BullMQ requires that `maxRetriesPerRequest` is null for blocking redis calls.
// Provide connection options object (preferred for portability inside containers).
// Set `maxRetriesPerRequest: null` to satisfy BullMQ's check (see bullmq v5).
const connectionOptions = { url: redisUrl, maxRetriesPerRequest: null as any };

const queue = new Queue('airtable_sync', { connection: connectionOptions });

export function getQueue() {
    return queue;
}

export function createWorker(processor: (job: any) => Promise<void>, opts?: { concurrency?: number }) {
        const worker = new Worker('airtable_sync', async (job) => {
            await processor(job.data);
        }, { connection: connectionOptions, concurrency: opts?.concurrency || 1 });

    worker.on('completed', (job) => {
        // eslint-disable-next-line no-console
        console.info(`[BullMQ] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        // eslint-disable-next-line no-console
        console.error(`[BullMQ] Job ${job?.id} failed`, err);
    });

    return worker;
}

export type QueueAddOptions = JobsOptions;

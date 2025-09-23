import Redis from '../infrastructure/redis/redis';
import { Project } from '../infrastructure/airtable/models';
import Logger from '../utils/logger';

type WorkerOptions = {
    intervalMs?: number; // refresh interval
    ttlSeconds?: number; // cache ttl for full list
};

let timer: NodeJS.Timeout | null = null;

export const startProjectCacheWorker = (opts: WorkerOptions = {}) => {
    const intervalMs = opts.intervalMs ?? 1000 * 60 * 5; // default 5 minutes
    const ttlSeconds = opts.ttlSeconds ?? 300; // default 5 minutes

    if (timer) {
        Logger.info('ProjectCacheWorker', 'Worker already running');
        return;
    }

    Logger.info('ProjectCacheWorker', `Starting worker - interval=${intervalMs}ms ttl=${ttlSeconds}s`);

    const run = async () => {
        try {
            Logger.info('ProjectCacheWorker', 'Refreshing projects full-list cache');
            const all = await Project.getAll({});
            await Redis.getInstance().set('projects:all', JSON.stringify(all), 'EX', ttlSeconds);
            Logger.info('ProjectCacheWorker', `Refreshed projects cache with ${all?.length || 0} items`);
        } catch (err) {
            Logger.error('ProjectCacheWorker', 'Failed to refresh projects cache', err);
        }
    };

    // run immediately then schedule
    void run();
    timer = setInterval(run, intervalMs) as unknown as NodeJS.Timeout;
};

export const stopProjectCacheWorker = () => {
    if (timer) {
        clearInterval(timer as any);
        timer = null;
        Logger.info('ProjectCacheWorker', 'Worker stopped');
    }
};

export default {
    start: startProjectCacheWorker,
    stop: stopProjectCacheWorker,
};

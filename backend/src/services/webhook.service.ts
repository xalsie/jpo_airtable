// import { Interactions, TInteractions } from '../infrastructure/airtable/models';
import Logger from '../utils/logger'
import { resetProjectCache } from '../workers/projectCacheWorker';

export type IWebhook = {
    resetCache: () => Promise<void>;
}

export class WebhookService implements IWebhook {
    async resetCache(): Promise<void> {
        try {
            resetProjectCache();
            Logger.info('WebhookService', 'Project cache reset successfully');
        } catch (error) {
            Logger.error('WebhookService', 'Error resetting cache:', error);
            throw new Error('Failed to reset cache');
        }
    }
}

export default WebhookService

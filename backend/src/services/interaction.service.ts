import { Interactions, TInteractions } from '../infrastructure/airtable/models';
import Logger from '../utils/logger'

export const InteractionService = {
    async getAll(params: { limit?: number; offset?: number } = {}): Promise<TInteractions[]> {
        try {
            const interactions = await Interactions.getAll({ fields: Object.values(Interactions.FieldsIds), ...params });
            return interactions;
        } catch (error) {
            Logger.error('InteractionService', 'Error fetching interactions:', error);
            throw new Error('Failed to fetch interactions');
        }
    },

    async getById(id: string): Promise<TInteractions | null> {
        try {
            const interaction = await Interactions.getById(id);
            return interaction;
        } catch (error) {
            Logger.error('InteractionService', `Error fetching interaction with id ${id}:`, error);
            throw new Error('Failed to fetch interaction');
        }
    }
}

export default InteractionService

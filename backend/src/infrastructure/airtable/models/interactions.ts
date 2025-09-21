import { z } from 'zod';
import { env } from '../../../config/env';
import AirtableService from '../airtable.service';

export class Interactions {    
    private static InteractionsTable = 'tbl7c0pi2d0FGCnwo';

    private static airtableService = AirtableService.getInstance(
        env.AIRTABLE_BASE_ID, this.InteractionsTable
    );

    static Schema = z.object({
        id: z.string(),
        type: z.enum(['like', 'dislike', 'comment']),
        author: z.array(z.string()).min(1),
        project: z.array(z.string()).min(1),
        created: z.string().optional().nullable(),
        updated: z.string().optional().nullable(),
    });

    static FieldsIds: Record<
        Exclude<keyof z.infer<typeof this.Schema>, 'id'>,
        string
    > = {
        type: 'flde8uhITeFSTqjDD',
        author: 'fldOtI1TsVDjMem85',
        project: 'fldwwD6cGyXNB5qZV',
        created: 'fldezw18icqLzNEXo',
        updated: 'fld9QmKqXxX3pBr29',
    };

    private static FieldIdToKeyMap: Record<string, string> = Object.entries(Interactions.FieldsIds).reduce((acc, [key, val]) => {
        acc[val] = key;
        return acc;
    }, {} as Record<string, string>);

    static async getAll({ view, fields }: { view?: string; fields?: string[] }): Promise<TInteractions[]> {
        const records = await this.airtableService.getAll({ view, fields });
        return records.map(r => AirtableService.remapRecordFields(r, this.FieldIdToKeyMap));
    }

    static async getById(id: string): Promise<TInteractions | null> {
        try {
            const record = await this.airtableService.getById(id);
            return AirtableService.remapRecordFields(record, this.FieldIdToKeyMap) as TInteractions;
        } catch (error) {
            return null;
        }
    }

    static async create(fields: Partial<TInteractions>): Promise<TInteractions> {
        const record = await this.airtableService.create(fields);
        return AirtableService.remapRecordFields(record, this.FieldIdToKeyMap) as TInteractions;
    }

    static async update(id: string, fields: Partial<TInteractions>): Promise<TInteractions> {
        const record = await this.airtableService.update(id, fields);
        return AirtableService.remapRecordFields(record, this.FieldIdToKeyMap) as TInteractions;
    }

    static async delete(id: string): Promise<boolean> {
        const result = await this.airtableService.delete(id);
        return result.success;
    }
}

export type TInteractions = z.infer<typeof Interactions.Schema>;

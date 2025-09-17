import { z } from 'zod';
import { env } from '../../../config/env';
import AirtableService from '../airtable.service';

export class User {    
    private static UsersTable = 'tblPZ5goHdnAUoblK';

    private static airtableService = AirtableService.getInstance(
        env.AIRTABLE_BASE_ID, this.UsersTable
    );

    static Schema = z.object({
        id: z.string(),
        lastname: z.string().min(1),
        firstname: z.string().min(1),
        avatar: z.string().optional().nullable(),
        school: z.string().min(1),
        promo: z.string().min(1),
        email: z.string().email(),
        telephone: z.string().min(10).max(15),
        password: z.string().min(6),
        isContacted: z.boolean().default(false),
        comments: z.array(z.string()).optional().nullable(),
        interactions: z.array(z.string()).optional().nullable(),
        interactions_count: z.number().optional().nullable(),
        activities_count: z.number().optional().nullable(),
        created: z.string().optional().nullable(),
        updated: z.string().optional().nullable(),
        likes: z.number().optional().nullable(),
        dislikes: z.number().optional().nullable(),
    });

    static FieldsIds: Record<
        Exclude<keyof z.infer<typeof this.Schema>, 'id'>,
        string
    > = {
        lastname: 'fld7c1QwaRBHzWYb5',
        firstname: 'fld0MygGJ98K0hpT1',
        avatar: 'fldqjjQ5elQvobywE',
        school: 'fldDbtAE3SGsYXM6Y',
        promo: 'fldkbQeKTl6DaGMlh',
        email: 'fldHZXZ38VqgdYWfQ',
        telephone: 'fldVgiXxYxjZ2ttie',
        password: 'fld1u1FcalVzZnRpO',
        isContacted: 'fldpkwd30OmpkqLW5',
        comments: 'fldIRkIRxbfhniSvm',
        interactions: 'fld5gFVSOpeLS76MI',
        interactions_count: 'fldjdL7WwfwgQDywq',
        activities_count: 'fldVJFLc3j5RQe6nY',
        created: 'fldGZ0xGWzgx4bWiT',
        updated: 'fldAGCCJ0WWnQG7Rf',
        likes: 'fldX3uRXSbcQyr9Aa',
        dislikes: 'fldl7vLnvEcVCuuXd'
    };

    static ViewIds = {
        emailOnly: 'viwdo6xfIhUWTnlVo'
    }

    static async getAll({ view, fields }: { view?: string; fields?: string[] }): Promise<TUser[]> {
        const records = await this.airtableService.getAll({ view, fields });
        return records as TUser[];
    }

    static async getById(id: string): Promise<TUser | null> {
        try {
            const record = await this.airtableService.getById(id);
            return record as TUser;
        } catch (error) {
            return null;
        }
    }

    static async create(fields: Partial<TUser>): Promise<TUser> {
        const record = await this.airtableService.create(fields);
        return record as TUser;
    }

    static async update(id: string, fields: Partial<TUser>): Promise<TUser> {
        const record = await this.airtableService.update(id, fields);
        return record as TUser;
    }

    static async delete(id: string): Promise<boolean> {
        const result = await this.airtableService.delete(id);
        return result.success;
    }
}

export type TUser = z.infer<typeof User.Schema>;

import { z } from 'zod';
import { env } from '../../../config/env';
import AirtableService from '../airtableService';

export class User {    
    private static UsersTable = 'tblPZ5goHdnAUoblK';

    private static airtableService = AirtableService.getInstance(
        env.AIRTABLE_BASE_ID, this.UsersTable
    );

    static UserSchema = z.object({
        id: z.uuid(),
        lastname: z.string().min(1),
        firstname: z.string().min(1),
        avatar: z.string().optional().nullable(),
        school: z.string().min(1),
        promo: z.string().min(1),
        email: z.email(),
        telephone: z.string().min(1),
        password: z.string().min(6),
        isContacted: z.boolean().default(false)
    });

    static FieldsIds: Record<
        Exclude<keyof z.infer<typeof this.UserSchema>, 'id'>,
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
        isContacted: 'fldpkwd30OmpkqLW5'
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

export type TUser = z.infer<typeof User.UserSchema>;

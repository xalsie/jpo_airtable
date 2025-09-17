import { z } from 'zod';
import AirtableService from '../airtableService';

export class User {
    private static UsersTable = 'tblPZ5goHdnAUoblK';

    private static airtableService = new AirtableService(
        process.env.AIRTABLE_BASE_ID || '',
        User.UsersTable
    );

    static UserSchema = z.object({
        id: z.uuid(),
        Credentials: z.string().min(1),
        LastName: z.string().min(1),
        FirstName: z.string().min(1),
        Avatar: z.string().url().optional().nullable(),
        School: z.string().min(1),
        Promo: z.string().min(1),
        Email: z.email(),
        telephone: z.string().min(1),
        Password: z.string().min(6),
        isContacted: z.boolean().default(false),
        CreatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid date format',
        }),
        UpdatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid date format',
        }),
        Comments: z.string().optional().nullable(),
    });

    static async getAll(): Promise<TUser[]> {
        const records = await this.airtableService.getAll();
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

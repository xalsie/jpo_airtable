import { z } from 'zod';
import { env } from '../../../config/env';
import AirtableService from '../airtable.service';

export class Project {    
    private static ProjectTable = 'tblXBumfKHHBc6gLu';

    private static airtableService = AirtableService.getInstance(
        env.AIRTABLE_BASE_ID, this.ProjectTable
    );

    static Schema = z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().optional().nullable(),
        students: z.array(z.string()).optional().nullable(),
        promo: z.string().min(1),
        year: z.string().min(1),
        image: z.string().optional().nullable(),
        links: z.array(z.string()).optional().nullable(),
        visibility: z.string().min(1),
        comments: z.array(z.string()).optional().nullable(),
        activities: z.array(z.string()).optional().nullable(),
        keywords: z.array(z.string()).optional().nullable(),
        created: z.string().optional().nullable(),
        updated: z.string().optional().nullable(),
    });

    static FieldsIds: Record<
        Exclude<keyof z.infer<typeof this.Schema>, 'id'>,
        string
    > = {
        title: 'fldxT5cxRzDPFVLB3',
        description: 'fld2nSsIRoRIQP14a',
        students: 'fldJhxbyyeYoZ8nTt',
        promo: 'fld6MXjQYhfxJYNTr',
        year: 'fldDg1wQ8YuVEkk2o',
        image: 'fldLTQgSl6SpRbUFr',
        links: 'fld18Zu2OM0cJDAz6',
        visibility: 'fldq0Wwla1q5Z2hMd',
        comments: 'fldmCWMfwDShxdCqQ',
        activities: 'fldcGp3K8W6Y80tWC',
        keywords: 'fldPsEA6ah2uZI5tC',
        created: 'fldkk3AXKsUWAoXAj',
        updated: 'flddcVwRMHcPE1gf3'
    };

    static async getAll({ view, fields }: { view?: string; fields?: string[] }): Promise<TProject[]> {
        const records = await this.airtableService.getAll({ view, fields });
        return records as TProject[];
    }

    static async getById(id: string): Promise<TProject | null> {
        try {
            const record = await this.airtableService.getById(id);
            return record as TProject;
        } catch (error) {
            return null;
        }
    }
}

export type TProject = z.infer<typeof Project.Schema>;

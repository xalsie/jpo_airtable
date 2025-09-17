import Airtable from 'airtable';
import { env } from '../../config';
import { Logger } from '../../utils';

export class AirtableService {
  private base: Airtable.Base;
  private tableName: string;

  constructor(baseId: string, tableName: string) {
    if (!baseId) {
      throw new Error('Airtable Base ID is required');
    }
    if (!tableName) {
      throw new Error('Airtable Table Name is required');
    }

    this.base = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(baseId);
    this.tableName = tableName;
  }

  async getAll(): Promise<Array<{ [key: string]: any }>> {
    try {
      const records = await this.base(this.tableName).select().all();
      return records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error: Error | any) {
      throw new Error(`Failed to fetch records: ${error.message}`);
    }
  }

  async getById(id: string): Promise<{ [key: string]: any }> {
    try {
      const record = await this.base(this.tableName).find(id);
      return {
        id: record.id,
        ...record.fields
      };
    } catch (error: Error | any) {
      throw new Error(`Failed to fetch record ${id}: ${error.message}`);
    }
  }

  async create(fields: Record<string, any>): Promise<{ [key: string]: any }> {
    try {
      const record = await this.base(this.tableName).create(fields);
      return {
        id: record.id,
        ...record.fields
      };
    } catch (error: Error | any) {
      throw new Error(`Failed to create record: ${error.message}`);
    }
  }

  async update(id: string, fields: Record<string, any>): Promise<{ [key: string]: any }> {
    try {
      const record = await this.base(this.tableName).update(id, fields);
      return {
        id: record.id,
        ...record.fields
      };
    } catch (error: Error | any) {
      throw new Error(`Failed to update record ${id}: ${error.message}`);
    }
  }

  async delete(id: string): Promise<{ success: boolean }> {
    try {
      await this.base(this.tableName).destroy(id);
      return { success: true };
    } catch (error: Error | any) {
      throw new Error(`Failed to delete record ${id}: ${error.message}`);
    }
  }
}

export default AirtableService;

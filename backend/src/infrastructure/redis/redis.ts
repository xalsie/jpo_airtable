import IORedis from 'ioredis';

export class Redis {
  private static client: InstanceType<typeof IORedis> | null = null;

  private constructor() {}

  public static getInstance(): InstanceType<typeof IORedis> {
    if (!Redis.client) {
      const redisUrl = process.env.REDIS_URL ?? 'redis://redis:6379';
      Redis.client = new IORedis(redisUrl);

      Redis.client.on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error('Redis error', err);
      });
    }

    return Redis.client;
  }

  public static async disconnect(): Promise<void> {
    if (Redis.client) {
      try {
        await Redis.client.quit();
      } finally {
        Redis.client = null;
      }
    }
  }
}

export default Redis;

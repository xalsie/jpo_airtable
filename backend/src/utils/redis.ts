import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

const redis = new Redis(redisUrl);

redis.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Redis error', err);
});

export default redis;

import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

export const redisClient = new Redis.default({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export const redisSubscriber = new Redis.default({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

export const redisPublisher = new Redis.default({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err: Error) => {
  console.error('Redis client error:', err);
});

redisSubscriber.on('connect', () => {
  console.log('Redis subscriber connected');
});

redisPublisher.on('connect', () => {
  console.log('Redis publisher connected');
});

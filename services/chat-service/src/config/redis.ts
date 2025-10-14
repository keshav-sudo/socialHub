// chat-service/src/config/redis.ts

import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

// Main Redis client for database operations (e.g., chat history)
export const redisClient = new Redis.default({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null, // ioredis v4+ needs this for retryStrategy
});

// Dedicated client for Socket.IO Redis Adapter (Publisher)
// .duplicate() is used to ensure a clean connection for the subscriber
export const redisPublisher = new Redis.default({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null,
});

// Dedicated client for Socket.IO Redis Adapter (Subscriber)
export const redisSubscriber = redisPublisher.duplicate(); // Correct way to create subscriber

// Logging
redisClient.on('connect', () => console.log('Redis client connected'));
redisPublisher.on('connect', () => console.log('Redis publisher connected'));
redisSubscriber.on('connect', () => console.log('Redis subscriber connected'));

redisClient.on('error', (err: Error) => console.error('Redis client error:', err.message));
redisPublisher.on('error', (err: Error) => console.error('Redis publisher error:', err.message));
redisSubscriber.on('error', (err: Error) => console.error('Redis subscriber error:', err.message));

// NOTE: We do not need a separate redisSubscriber initialized from scratch
// It's safer to use .duplicate() from the publisher in ioredis.
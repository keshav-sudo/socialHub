import { Kafka } from 'kafkajs';

const BROKERS = (process.env.KAFKA_BROKER || 'localhost:9092').split(',');
const CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'feed-service';

export const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  retry: {
    retries: 5,
    initialRetryTime: 300,
    maxRetryTime: 30000,
  },
});

console.log('📡 Kafka configured with brokers:', BROKERS);

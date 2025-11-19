import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis.js';
import { startKafkaConsumer, stopKafkaConsumer } from './consumers/kafkaConsumer.js';
import feedRoutes from './routes/feedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

app.use('/api/feed', feedRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'feed-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  try {
    await connectRedis();
    console.log('✅ Redis connected');

    await startKafkaConsumer();
    console.log('✅ Kafka consumer started');

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Feed Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, starting graceful shutdown...');
  await stopKafkaConsumer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, starting graceful shutdown...');
  await stopKafkaConsumer();
  process.exit(0);
});

startServer();

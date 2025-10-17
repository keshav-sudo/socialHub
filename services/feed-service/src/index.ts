import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis.js';
import { startKafkaConsumer, stopKafkaConsumer } from './consumers/kafkaConsumer.js';
import feedRoutes from './routes/feedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Routes
app.use('/api/feed', feedRoutes);

// Root health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'feed-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Start server
async function startServer() {
  try {
    // Connect to Redis
    await connectRedis();
    console.log('✅ Redis connected');

    // Start Kafka consumer
    await startKafkaConsumer();
    console.log('✅ Kafka consumer started');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Feed Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
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

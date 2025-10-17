import { kafka } from '../config/kafka.js';
import { FeedService } from '../services/FeedService.js';

const GROUP_ID = process.env.KAFKA_GROUP_ID || 'feed-service-group';
const consumer = kafka.consumer({ groupId: GROUP_ID });

export const startKafkaConsumer = async () => {
  const feedService = new FeedService();

  try {
    await consumer.connect();
    console.log('✅ Kafka Consumer connected');

    // Subscribe to all relevant topics
    await consumer.subscribe({ topics: ['POST_TOPIC', 'LIKE_TOPIC', 'COMMENT_TOPIC'], fromBeginning: false });
    console.log('✅ Subscribed to topics: POST_TOPIC, LIKE_TOPIC, COMMENT_TOPIC');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString();
          if (!value) return;

          const event = JSON.parse(value);
          console.log(`📨 Received event from ${topic}:`, event.eventType);

          switch (topic) {
            case 'POST_TOPIC':
              await handlePostEvent(event, feedService);
              break;
            case 'LIKE_TOPIC':
              await handleLikeEvent(event, feedService);
              break;
            case 'COMMENT_TOPIC':
              await handleCommentEvent(event, feedService);
              break;
            default:
              console.log('Unknown topic:', topic);
          }
        } catch (error) {
          console.error('❌ Error processing message:', error);
        }
      },
    });
  } catch (error) {
    console.error('❌ Kafka Consumer Error:', error);
    throw error;
  }
};

// Handle POST events
async function handlePostEvent(event: any, feedService: FeedService) {
  const { eventType, data } = event;

  switch (eventType) {
    case 'post.created':
      await feedService.addPostToFollowerFeeds(data.authorId, data.postId, data.username);
      console.log(`✅ Post ${data.postId} added to follower feeds`);
      break;
    default:
      console.log('Unknown post event type:', eventType);
  }
}

// Handle LIKE events
async function handleLikeEvent(event: any, feedService: FeedService) {
  const { eventType, data } = event;

  switch (eventType) {
    case 'like.created':
      // Update engagement score for the post
      await feedService.updatePostEngagement(data.postId, 'like');
      console.log(`✅ Like engagement updated for post ${data.postId}`);
      break;
    default:
      console.log('Unknown like event type:', eventType);
  }
}

// Handle COMMENT events
async function handleCommentEvent(event: any, feedService: FeedService) {
  const { eventType, data } = event;

  switch (eventType) {
    case 'comment.created':
      // Update engagement score for the post
      await feedService.updatePostEngagement(data.postId, 'comment');
      console.log(`✅ Comment engagement updated for post ${data.postId}`);
      break;
    default:
      console.log('Unknown comment event type:', eventType);
  }
}

// Graceful shutdown
export const stopKafkaConsumer = async () => {
  await consumer.disconnect();
  console.log('✅ Kafka Consumer disconnected');
};

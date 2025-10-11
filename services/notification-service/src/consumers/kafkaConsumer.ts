import {
  handlePostcreated,
  handleCommentCreate,
  handleFollowCreate,
  handleLikecreate,
} from "./handler.js";

import { consumer, connectConsumer } from "../utils/Kafka/kafkaClient.js";
import dotenvVar from "../types/Dotenv.js";

const TOPICS = dotenvVar.TOPICS;

export const startNotificationConsumer = async () => {
  const isConnected = await connectConsumer();
  if (!isConnected) {
    console.error("🚫 Kafka connection failed. Consumer will not start.");
    return;
  }

  await consumer.subscribe({ topics: TOPICS, fromBeginning: true });
  console.log(`👂 Kafka Consumer is listening on topics: ${TOPICS.join(", ")}`);

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      let success = false;

      try {
        const messageValue = message.value?.toString();
        if (!messageValue) return;

        console.log(`[DEBUG] Raw Kafka Message Value: ${messageValue}`);

        const event = JSON.parse(messageValue);
        const { eventType, data: eventPayload } = event;

        if (!eventPayload) {
          console.error(`[FATAL] Missing 'data' field in event payload for eventType: ${eventType}`);
          return;
        }

        switch (topic) {
          case "POST_TOPIC":
            switch (eventType) {
              case "post.created":
                success = await handlePostcreated(eventPayload);
                break;
              case "comment.created":
                success = await handleCommentCreate(eventPayload);
                break;
              case "like.created":
                success = await handleLikecreate(eventPayload);
                break;
              default:
                console.log(`[${topic}] Ignoring eventType: ${eventType}`);
                break;
            }
            break;

          case "USER_TOPIC":
            if (eventType === "follow.created") {
              success = await handleFollowCreate(eventPayload);
            } else {
              console.log(`[${topic}] Ignoring eventType: ${eventType}`);
            }
            break;

          default:
            console.log(`[ALERT] Unhandled topic received: ${topic}`);
            break;
        }

        if (success) {
          console.log(`✅ Event processed successfully: ${eventType} (Topic: ${topic})`);
        } else {
          console.warn(`⚠️ Event failed or returned false: ${eventType} (Topic: ${topic})`);
        }
      } catch (error) {
        console.error(`❌ FATAL ERROR processing Kafka message from ${topic}:`, error);
        console.error(`❌ Message that failed to parse: ${message.value?.toString()}`);
      }
    },
  });
};

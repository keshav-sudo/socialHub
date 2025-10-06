import handlePostcreated from "./handler.js";
import { consumer, connectConsumer } from "../utils/Kafka/kafkaClient.js";
import dotenvVar from "../types/Dotenv.js";

const TOPICS = dotenvVar.TOPICS

export const startNotificationConsumer = async () => {
  const isConnected = await connectConsumer();
  if (!isConnected) {
    console.error("🚫 Kafka connection failed. Consumer will not start.");
    return;
  }

  await consumer.subscribe({ topics: TOPICS, fromBeginning: true });

  console.log(`👂 Kafka Consumer is listening on topics: ${TOPICS.join(", ")}`);

  await consumer.run({
    eachMessage: async (payload) => {
      const { topic, message } = payload;
      let success = false;

      try {
        const messageValue = message.value?.toString();
        if (!messageValue) return;

        const event = JSON.parse(messageValue);
        const { eventType, ...data } = event;

        switch (topic) {
          case "POST_TOPIC":
            if (eventType === "post.created") {
              success = await handlePostcreated(data);
            } else {
              console.log(`[${topic}] Ignoring eventType: ${eventType}`);
            }
            break;
          default:
            console.log(`[ALERT] Unhandled topic received: ${topic}`);
            break;
        }

        if (success) {
          console.log(
            `✅ Event processed and offset handled for ${eventType} on ${topic}.`
          );
        }
      } catch (error) {
        console.error(
          `❌ FATAL ERROR in processing message from ${topic}:`,
          error
        );
      }
    },
  });
};

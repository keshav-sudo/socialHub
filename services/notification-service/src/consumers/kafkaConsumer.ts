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

        // [DEBUG] Log the raw string before parsing (keep this for now)
        console.log(`[DEBUG] Raw Kafka Message Value: ${messageValue}`);
        const event = JSON.parse(messageValue);
        const { eventType, data: eventPayload, ...rest } = event; // <-- FIX IS HERE!
        // We explicitly destructure 'data' as 'eventPayload'.
        // The rest of the event (like 'timestamp') is stored in 'rest' if needed.
        if (!eventPayload) {
            console.error(`[FATAL] Missing event payload (key 'data') for eventType: ${eventType}`);
            return;
        }
        switch (topic) {
          case "POST_TOPIC":
            if (eventType === "post.created") {
              success = await handlePostcreated(eventPayload);
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
        console.error(`❌ Message that failed to parse: ${message.value?.toString()}`);
      }
    },
  });
};
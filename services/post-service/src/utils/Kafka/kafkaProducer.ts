import { Kafka } from "kafkajs";
import dotenvVar from "../../types/Dotenv.js";

const BROKERS :string[] = dotenvVar.KAFKA_BROKER.split(","); 
const CLIENTID :string = dotenvVar.KAFKA_CLIENT_ID;
const kafka = new Kafka({
    clientId: CLIENTID,
    brokers: BROKERS,
    retry: {
        retries: 5
    }
})

const producer = kafka.producer();

export const connectProducer = async() => {
     await producer.connect();
     console.log('✅ Kafka Producer connected.');
}

export const sendEvent = async( topic :string, eventType:string, data:object) => {
    const message = {
    eventType,
    timestamp: new Date().toISOString(),
    data,
    };

    try {
          await producer.send({
          topic: topic,
          messages: [{ value: JSON.stringify(message) }],
          });      
    } catch (error) {
        console.error(`❌ Failed to send event to ${topic}: ${eventType}`, error);

    }
}
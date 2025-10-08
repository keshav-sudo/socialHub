import { Kafka, Partitioners } from "kafkajs";
import { dotenvVars } from "../types/dotenvVars.js";

const BROKERS = dotenvVars.KAFKA_BROKER.split(",");
const CLIENTID: string = dotenvVars.KAFKA_CLIENT_ID;
const kafka = new Kafka({
  clientId: CLIENTID,
  brokers: BROKERS,
  retry: {
    retries: 5,
  },
});


const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner
});

export const connectProducer = async() => {
     await producer.connect();
     console.log('✅ Kafka Producer connected in follow service.');
}

export const sendEvent = async( topic :string, eventType:string, data:object): Promise<boolean> => {
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
          return true;
    } catch (error) {
        console.error(`❌ Failed to send event to ${topic}: ${eventType}`, error);
        return false;

    }
}
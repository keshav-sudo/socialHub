import { Kafka } from "kafkajs"
import dotenvVar from "../../types/Dotenv.js"

const BROKERS : string[] = dotenvVar.KAFKA_BROKER.split(",") ;
const CLIENTID : string = dotenvVar.KAFKA_CLIENT_ID;
const kafka = new Kafka({
    clientId: CLIENTID,
    brokers: BROKERS,
    retry : {
        retries: 5
    }
})

const consumer = kafka.consumer({
    groupId : dotenvVar.GROUP_ID
});


export const consumeEvent = async(topic : string) => {
    await consumer.subscribe({topic: topic, fromBeginning: true});
    await consumer.run({
        eachMessage: async({topic , partition, message})=> {
            try {
                const messageValue = message.value ? message.value.toString() : '';
            const eventData = JSON.parse(messageValue);
            console.log(`Consumed event from topic: ${topic}`);
            console.log(`Event Type: ${eventData.eventType}`);
            console.log('Data:', eventData.data);
            } catch (error) {
                console.error("❌ Error processing message:", error);
            }   
        }
    })
      console.log(`👂 Kafka Consumer is listening on topic: ${topic}`);
}

export const connectConsumer = async(): Promise<boolean> => {
    try {
        await consumer.connect();
        console.log('✅ Kafka Consumer connected.');
        return true;
    } catch (error) {
        return false;
    }
    
}

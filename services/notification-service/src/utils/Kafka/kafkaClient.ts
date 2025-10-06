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

export const consumer = kafka.consumer({
    groupId : dotenvVar.GROUP_ID
});



export const connectConsumer = async(): Promise<boolean> => {
    try {
        await consumer.connect();
        console.log('✅ Kafka Consumer connected.');
        return true;
    } catch (error) {
        return false;
    }
    
}

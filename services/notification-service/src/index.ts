import { Response, Request } from "express";
import express from "express";
import dotenvVar from "./types/Dotenv.js";
import { consumeEvent, connectConsumer } from "./utils/Kafka/kafkaClient.js";

const app = express();

const TARGET_TOPIC = 'POST_TOPIC';
app.use(express.json());

app.get("/notify", async (req: Request, res: Response) => {
    const connect = await connectConsumer();
    if (!connect) {
        return res.json({
            message: "Kafka not connected"
        });
    }

    const data = await consumeEvent(TARGET_TOPIC);
    return res.status(200).json({
        data: data
    });
});

app.listen(dotenvVar.PORT, () => {
    console.log(`App is starting on Port ${dotenvVar.PORT}`);
    console.log(`👂 Kafka Consumer is listening on topic: ${TARGET_TOPIC}`);
});

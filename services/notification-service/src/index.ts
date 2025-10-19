import { Response, Request } from "express";
import express from "express";
import dotenvVar from "./types/Dotenv.js";
import { startNotificationConsumer } from "./consumers/kafkaConsumer.js";
import notifyRoutes from "./routes/post.route.js"
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/notify/", notifyRoutes)

const TARGET_TOPIC = dotenvVar.TOPICS;


const startServerAndConsumer = async() => {
    await startNotificationConsumer();
    app.listen(dotenvVar.PORT, '0.0.0.0', () => {
    console.log(`App is starting on Port ${dotenvVar.PORT}`);
    console.log(`👂 Kafka Consumer is listening on topic: ${TARGET_TOPIC}`);
});

}
startServerAndConsumer();

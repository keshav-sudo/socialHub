import express, {  Request,  Response } from "express";
import http from "http"
import dotenvVar from "./types/Dotenv.js";
import { allRoutes } from "./routes/index.js";
import cors from "cors";
import { connectProducer } from "./utils/Kafka/kafkaProducer.js";

const app = express();
const PORT = dotenvVar.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use('/api/v1/posts/' , allRoutes.postRoutes);  
app.use('/api/v1/posts/' , allRoutes.commentRoutes);  
app.use('/api/v1/posts/' , allRoutes.likeRoutes);
app.use('/api/v1/ai/' , allRoutes.genAiRoutes);  

connectProducer();

const server:http.Server = app.listen( PORT , ()=> {
     console.log(`Server is running on http://localhost:${PORT}`);
})

const shutdown = async() => {
    console.log("\n ⏳ Shutting down...");
    server.close(async ()=> {
        console.log("🛑 HTTP server closed");
    })
    process.exit(0);

}


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
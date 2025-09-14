import express from "express";
import redisClient from "./config/redisClient.js";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import http from "http";

import authRoutes from "./routes/user.route.js"

const app = express();
const PORT = 5000;

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth" , authRoutes);

app.get('/' , (req : Request, res : Response) => {
    res.send("Your Server Is on");
})

app.get("/read-cookie", (req, res) => {
  const token = req.cookies.token; 
  res.send(`Token: ${token}`);
});

const server:http.Server = app.listen( PORT , ()=> {
     console.log(`Server is running on http://localhost:${PORT}`);
})

const shutdown = async() => {
    console.log("\n ⏳ Shutting down...");
    server.close(async ()=> {
        console.log("🛑 HTTP server closed");
    })
    await redisClient.quit();
    console.log("🔌 Redis connection closed");
    process.exit(0);

}


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
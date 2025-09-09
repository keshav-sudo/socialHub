import express from "express";
import redisClient from "./config/redisClient.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 5000;
app.use(cookieParser());
app.use(express.json());
app.get('/', (req, res) => {
    res.send("Your Server Is on");
});
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const shutdown = async () => {
    console.log("\n ⏳ Shutting down...");
    server.close(async () => {
        console.log("🛑 HTTP server closed");
    });
    await redisClient.quit();
    console.log("🔌 Redis connection closed");
    process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
//# sourceMappingURL=index.js.map
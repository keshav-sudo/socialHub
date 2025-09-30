import express, {  Request,  Response } from "express";
import http from "http"
import { Router } from "express";
import dotenvVar from "./types/Dotenv.js";
import PostRoutes from "./routes/post.routes.js"
import cors from "cors";

const app = express();
const PORT = dotenvVar.PORT;

app.use(cors());
// app.use(Router()); // Hata diya - yeh unnecessary hai
app.use(express.json());

// ✅ FIX: Trailing slash lagaya to match Nginx's location /posts/
app.use('/posts/' , PostRoutes);  


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
import express, {  Request,  Response } from "express";
import http from "http"
import { Router } from "express";
import Posttest from "./utils/multerRoute.js"
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(Router());
app.use(express.json());


app.get('/' , (req: Request, res : Response) => {
    res.send("Your Server Is on 5000");
})

app.use('/api/test' , Posttest);  



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
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { setupRoutes } from "./routes/routes.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


setupRoutes(app);

app.get("/", (req : Request, res : Response) => {
  res.send("API Gateway is running 🚀");
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});

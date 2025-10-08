import * as dotenv from "dotenv";
dotenv.config();

interface dotenvInterface {
  URI: string;
  USER: string;
  PASSWORD: string;
  KAFKA_BROKER: string;
  KAFKA_CLIENT_ID: string;
  PORT: number;
}

export const dotenvVars: dotenvInterface = {
  URI: process.env.URI || "",
  USER: process.env.USER || "",
  PASSWORD: process.env.PASSWORD || "",
  KAFKA_BROKER: process.env.KAFKA_BROKER || "",
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "",
  PORT: Number(process.env.PORT) || 5004,
};

console.log(dotenvVars);

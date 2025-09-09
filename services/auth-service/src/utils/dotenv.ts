import dotenv from "dotenv";

dotenv.config();

interface DotenvConfig {
    JWT_SECRET: string;
    REDIS_PORT: number;
    REDIS_CLIENT: string;
    EMAIL_FROM: string;
    EMAIL_PASS: string;
}

export const Dotenvs: DotenvConfig = {
    JWT_SECRET: process.env.JWT_SECRET || "",
    REDIS_PORT: process.env.REDIS_PORT ?  Number(process.env.REDIS_PORT) : 6379,
    REDIS_CLIENT: process.env.REDIS_CLIENT || "127.0.0.1",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    EMAIL_PASS: process.env.EMAIL_PASS || ""
};



import * as dotenv from 'dotenv';
dotenv.config();

interface Dotenv {
    DATABASE_URL: string;
    PORT: number;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    KAFKA_BROKER: string;
    KAFKA_CLIENT_ID:string;
}

const dotenvVar : Dotenv = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    PORT: Number(process.env.PORT) || 5001,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "", 
    KAFKA_BROKER: process.env.KAFKA_BROKER || "",
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "",
}

console.log(dotenvVar);

export default dotenvVar;
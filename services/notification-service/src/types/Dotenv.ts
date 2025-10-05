import * as dotenv from 'dotenv';
dotenv.config({ override: true }); 

interface Dotenvs {
    DATABASE_URL: string;
    PORT : number;
    KAFKA_BROKER : string;
    KAFKA_CLIENT_ID: string;
    GROUP_ID: string;
}

const dotenvVar : Dotenvs = {
    DATABASE_URL: process.env.DATABASE_URL || "", 
    PORT: Number(process.env.PORT) || 5002, // Changed default to 5002 to match .env
    KAFKA_BROKER: process.env.KAFKA_BROKER || "", 
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "",
    GROUP_ID : process.env.GROUP_ID || ""
}

console.log(dotenvVar);

export default dotenvVar;
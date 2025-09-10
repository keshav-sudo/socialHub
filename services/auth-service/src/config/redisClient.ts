import  {Redis} from "ioredis";
import { Dotenvs } from "../types/dotenv.js";


const redisClient = new Redis ({
    port : Dotenvs.REDIS_PORT,
    host : Dotenvs.REDIS_CLIENT
});

redisClient.on("connect", ()=> {
    console.log("🔌 Connected to Redis");
})

redisClient.on("error", (err)=> {
    console.log("Redis Error", err);
})

export default redisClient;
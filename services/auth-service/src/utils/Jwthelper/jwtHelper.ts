import jwt, { JwtPayload } from "jsonwebtoken"
import { Dotenvs } from "../../types/dotenv.js"
import { Payload } from "../../types/express.js";



export const generateToken = (token : string): Payload =>{
    if(!Dotenvs.JWT_SECRET){
         throw new Error("JWT_SECRET is not defined");
    }
    try {
        const decode = jwt.verify(token , Dotenvs.JWT_SECRET) as Payload
        return decode;
    } catch (error) {
        throw new Error("Invalid token");
    }
}
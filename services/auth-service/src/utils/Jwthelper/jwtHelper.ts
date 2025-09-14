import jwt from "jsonwebtoken"
import { Dotenvs } from "../../types/dotenv.js"
import { Payload } from "../../types/express.js";

export const generateToken = (Payload: Payload): string => {
    if (!Dotenvs.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        const token = jwt.sign(Payload, Dotenvs.JWT_SECRET);
        return token;
    } catch (error) {
        console.error("Error signing token:", error);
        throw new Error("Token generation failed");
    }
}

export const decodeToken = (token: string): Payload | null => {
    if (!Dotenvs.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        const decoded = jwt.verify(token, Dotenvs.JWT_SECRET) as Payload;
        return decoded;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}
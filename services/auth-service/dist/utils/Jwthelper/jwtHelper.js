import jwt from "jsonwebtoken";
import { Dotenvs } from "../../types/dotenv.js";
export const generateToken = (Payload) => {
    if (!Dotenvs.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        const token = jwt.sign(Payload, Dotenvs.JWT_SECRET);
        return token;
    }
    catch (error) {
        console.error("Error signing token:", error);
        throw new Error("Token generation failed");
    }
};
//# sourceMappingURL=jwtHelper.js.map
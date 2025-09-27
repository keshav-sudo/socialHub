import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../utils/Jwthelper/jwtHelper.js";
import { Payload } from "../types/express.js";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).end();
        }

        const decoded : Payload | any = decodeToken(token);

        if (!decoded) {
            return res.status(401).end();
        }
        res.setHeader('x-user-payload', JSON.stringify(decoded));
        return res.status(200).end();

    } catch (error: any) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).end();
        }
        return res.status(500).end();
    }
}
export default verifyUser;
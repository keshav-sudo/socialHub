import { Role ,  } from "../../generated/prisma/index.js";

export interface Payload {
    id : string;
    role : Role;
    email : string;
    isVerified : boolean;
    username ? : string ;
}

declare global{
    namespace Express {
        export interface Request{
            user? : Payload;
            session?: {
                token?: string;
            } | null;
        }
    }
}export {};
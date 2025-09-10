import dotenv from "dotenv";
dotenv.config();
export const Dotenvs = {
    JWT_SECRET: process.env.JWT_SECRET || "",
    REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    REDIS_CLIENT: process.env.REDIS_CLIENT || "127.0.0.1",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    EMAIL_PASS: process.env.EMAIL_PASS || "",
    OTP_EXPIRY_SECONDS: process.env.OTP_EXPIRY_SECONDS ? Number(process.env.OTP_EXPIRY_SECONDS) : 300
};
console.log(Dotenvs);
//# sourceMappingURL=dotenv.js.map
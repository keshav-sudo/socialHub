import dotenv from "dotenv";
dotenv.config();
const Dotenvs = {
    JWT_SECRET: process.env.JWT_SECRET || "",
    REDIS_PORT: process.env.REDIS_PORT || "",
    REDIS_CLIENT: process.env.REDIS_CLIENT || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    EMAIL_PASS: process.env.EMAIL_PASS || ""
};
console.log(Dotenvs);
//# sourceMappingURL=Dotenv.js.map
import redisClient from "../../config/redisClient.js";
import { Dotenvs } from "../../types/dotenv.js";
const saveOtpToRedis = async (email, otp) => {
    const key = `otp:${email}`;
    await redisClient.set(key, otp, "EX", Dotenvs.OTP_EXPIRY_SECONDS);
};
const getOtpFromRedis = async (email) => {
    const key = `otp:${email}`;
    const otp = await redisClient.get(key);
    return otp;
};
const verifyOtp = async (email, inputOtp) => {
    const storeOtp = await getOtpFromRedis(email); // just pass email, no prefix
    if (!storeOtp)
        return false;
    return storeOtp === inputOtp;
};
const deleteOtp = async (email) => {
    const key = `otp:${email}`;
    await redisClient.del(key);
};
export default {
    saveOtpToRedis,
    getOtpFromRedis,
    verifyOtp,
    deleteOtp
};
//# sourceMappingURL=RedisOtpstore.js.map
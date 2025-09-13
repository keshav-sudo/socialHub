import redisClient from "../../config/redisClient.js";
import { Dotenvs } from "../../types/dotenv.js";
export const saveOtpToRedis = async (email, otp) => {
    const key = `otp:${email}`;
    await redisClient.set(key, otp, "EX", Dotenvs.OTP_EXPIRY_SECONDS);
};
export const getOtpFromRedis = async (email) => {
    const key = `otp:${email}`;
    const otp = await redisClient.get(key);
    return otp;
};
export const verifyOtp = async (email, inputOtp) => {
    const storeOtp = await getOtpFromRedis(`otp${email}`);
    if (!storeOtp)
        return false;
    return storeOtp === inputOtp;
};
export const deleteOtp = async (email) => {
    const key = `otp:${email}`;
    await redisClient.del(key);
};
//# sourceMappingURL=OtpStoreRedis.js.map
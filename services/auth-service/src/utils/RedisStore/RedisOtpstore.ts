import redisClient from "../../config/redisClient.js";
import { Dotenvs } from "../../types/dotenv.js";

const saveOtpToRedis = async (email: string, otp: string): Promise<void> => {
  const key = `otp:${email}`;
  await redisClient.set(key, otp, "EX", Dotenvs.OTP_EXPIRY_SECONDS);
};

const getOtpFromRedis = async (email: string): Promise<string | null> => {
  const key = `otp:${email}`;
  const otp = await redisClient.get(key);
  return otp;
};

const verifyOtp = async (email: string, inputOtp: string): Promise<boolean> => {
  const storeOtp = await getOtpFromRedis(`otp${email}`);
  if (!storeOtp) return false;
  return storeOtp === inputOtp;
};

const deleteOtp = async (email: string): Promise<void> => {
  const key = `otp:${email}`;
  await redisClient.del(key);
};

export default {
  saveOtpToRedis,
  getOtpFromRedis,
  verifyOtp,
  deleteOtp
}

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  resetPassBody,
  verifyOtpBody,
  resetPass,
} from "../model/user.model.js";
import prisma from "../config/prismaClient.js";
import OtpStore from "../utils/OtpStore/index.js";
import RedisOtpstore from "../utils/RedisStore/RedisOtpstore.js";
import sendVerifyOtp from "../utils/OtpStore/sendVerifyOtp.js";
import { decodeToken, generateToken } from "../utils/Jwthelper/jwtHelper.js";
import { Payload } from "../types/express.js";

export const requestPassReset = async (req: Request, res: Response) => {
  try {
    const parsedData = resetPassBody.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: parsedData.error,
      });
    }

    const { email } = parsedData.data;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const Otp: string = OtpStore.generateOtp(6);
    await RedisOtpstore.saveOtpToRedis(email, Otp);
    await sendVerifyOtp(email, Otp);

    console.log("OTP for password reset: ", Otp);
    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const verifyPassResetOtp = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const { otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const safePasred = verifyOtpBody.safeParse({ email, otp });
    if (!safePasred.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: safePasred.error,
      });
    }
    const isValidOtp = await RedisOtpstore.verifyOtp(email, otp);
    console.log("isValidOtp", isValidOtp);
    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }
    const updateBody = await prisma.user.update({
      where: { email: email },
      data: { isVerified: true },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        role: true,
      },
    });

    if (!updateBody) {
      return res.status(500).json({
        success: false,
        message: "Unable to Find user",
      });
    }

    await RedisOtpstore.deleteOtp(email);

    const PayloadReset: Payload = {
      email: updateBody.email,
      id: updateBody.id,
      role: updateBody.role,
      isVerified: updateBody.isVerified,
    };

    const resetToken = generateToken(PayloadReset);

    return res.status(200).json({
      success: true,
      message: "OTP verified, you can now reset your password",
      resetToken: resetToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const parsedData = resetPass.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: parsedData.error,
      });
    }
    const { email, newPassword } = parsedData.data;
    const decoded = decodeToken(req.cookies.resetToken);
    if (!decoded || decoded.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });
    res.clearCookie("resetToken");
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

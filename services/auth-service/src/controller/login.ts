import { Request, Response } from "express";
import { generateToken } from "../utils/Jwthelper/jwtHelper.js";
import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import { loginBody } from "../model/user.model.js";
import { Payload } from "../types/express.js";

const isEmail = (identifier: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const parsedData = loginBody.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: parsedData.error,
      });
    }

    const { identifier, password } = parsedData.data;
    let existingUser ;
    if (isEmail(identifier)) {
      existingUser = await prisma.user.findUnique({
        where: { email: identifier },
      });
    } else {
      existingUser = await prisma.user.findUnique({
        where: { username: identifier },
      });
    }
    if(!existingUser){
        return res.status(400).json({
            success : false,
            message : "user not find"
        })
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const PaloadBody: Payload = {
      id: existingUser.id,
      role: existingUser.role,
      username : existingUser.username,
      email: existingUser.email,
      isVerified: existingUser.isVerified,
    };

    const token = generateToken(PaloadBody);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        username : existingUser.username,
        email: existingUser.email,
        isVerified: existingUser.isVerified,
        role: existingUser.role,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

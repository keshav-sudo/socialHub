import { Request, Response } from "express";
import { resetPassBody, verifyOtpBody } from "../model/user.model.js";
import prisma from "../config/prismaClient.js";
import OtpStore from "../utils/OtpStore/index.js";
import RedisOtpstore from "../utils/RedisStore/RedisOtpstore.js";
import sendVerifyOtp from "../utils/OtpStore/sendVerifyOtp.js";

export const requestPassReset = async(req: Request, res:Response)=> {
    try {
        const parsedData = resetPassBody.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                success : false,
                message : "Invalid request data",
                error : parsedData.error
            })
        }

        const {email} = parsedData.data;
        const existingUser = await prisma.user.findUnique({
            where : {
                email : email
            }
        })
        if(!existingUser){
            return res.status(400).json({
                success : false,
                message : "User does not exist"
            })
        }

        const Otp : string = OtpStore.generateOtp(6);
        await RedisOtpstore.saveOtpToRedis(email, Otp);
        await sendVerifyOtp(email, Otp);

        console.log("OTP for password reset: ", Otp);
        return res.status(200).json({
            success : true,
            message : "OTP sent to your email"
        })

        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error",
            error 
        })
    }
}

export const verifyPassResetOtp = async(req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const {otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({
                success : false,
                message : "Email and OTP are required"
            })
        }

    const safePasred = verifyOtpBody.safeParse({email , otp})
    if(!safePasred.success){ 
        return res.status(400).json({
            success : false,
            message : "Invalid request data",
            error : safePasred.error
        })
    }
    const isValidOtp = await RedisOtpstore.verifyOtp(email, otp);
    if(!isValidOtp){
        return res.status(400).json({
            success : false,
            message : "Invalid or expired OTP"
        });     
    }
    await RedisOtpstore.deleteOtp(email);
    return res.status(200).json({
        success : true,
        message : "OTP verified successfully"
    })

    } 
    catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error",
            error
        })
        
    }
}


import { Request, Response } from "express";
import { generateToken } from "../utils/Jwthelper/jwtHelper.js";
import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import { loginBody } from "../model/user.model.js";
import { Payload } from "../types/express.js";

export const loginController = async(req: Request, res : Response) => {
    try {
        const parsedData = loginBody.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                success : false,
                message : "Invalid request data",
                error : parsedData.error
            })
        }

        const {email , password} = parsedData.data;
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
        
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        }
        const PaloadBody : Payload = {
            id : existingUser.id,
            role : existingUser.role,
            email : existingUser.email,
            isVerified : existingUser.isVerified
        }
        
        const token = generateToken(PaloadBody);
        res.cookie("token" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ 
            success : true,
            message : "Login successful",
            user : {
                id : existingUser.id,
                name : existingUser.name,
                email : existingUser.email,
                isVerified : existingUser.isVerified,
                role : existingUser.role
            }
         })
        
    } catch (error) {
        res.status(500).json({ 
            success : false,
            message : "Internal server error",
            error : error instanceof Error ? error.message : String(error)
        })

    }
}
import { signupBody } from "../model/user.model.js";
import { Request, Response } from "express";
import { generateToken } from "../utils/Jwthelper/jwtHelper.js";
import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import { Payload } from "../types/express.js";



export const signupController = async(req: Request, res : Response) => {
    try {
        const parsedBody = signupBody.safeParse(req.body);
        if(!parsedBody.success){
            return res.status(400).json({
                success : false,
                message : "Invalid request data",
                error : parsedBody.error
            })
        }

        const {name , email , password} = parsedBody.data;
        const existingUser = await prisma.user.findUnique({
            where : {
                email : email
            }
        })
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password,  10);
        const newUser = await prisma.user.create({
            data : {
                name,
                email,
                password : hashedPassword,
                isVerified : false
            }
        })

        const PayloadBody : Payload = {
            id : newUser.id,
            role : newUser.role,
            email : newUser.email,
            isVerified : newUser.isVerified
        }

        const token = generateToken(PayloadBody);
        res.cookie("token" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ 
            success : true,
            message : "User created successfully",
            user : {
                id : newUser.id,
                name : newUser.name,
                email : newUser.email,
                isVerified : newUser.isVerified,
                role : newUser.role
            }
          })


    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Internal server error",
            error
        })
    }

}
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

        const {name , email , password, username} = parsedBody.data;
        const existingUser = await prisma.user.findUnique({
            where : {
                email : email,
                username : username
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
                username,
                password : hashedPassword,
                isVerified : false
            }
        })

        const PayloadBody : Payload = {
            id : newUser.id,
            username : newUser.username,
            role : newUser.role,
            email : newUser.email,
            isVerified : newUser.isVerified
        }

        const token = generateToken(PayloadBody);

        return res.status(201).json({ 
            success : true,
            message : "User created successfully",
            user : {
                id : newUser.id,
                name : newUser.name,
                email : newUser.email,
                username : newUser.username,
                isVerified : newUser.isVerified,
                role : newUser.role
            },
            token : token
          })


    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Internal server error",
            error
        })
    }

}
import { z} from "zod"

export const signupBody = z.object({
    name : z.string().max(30),
    email : z.email(),
    password : z.string().min(6).max(30),

})

export const loginBody = z.object({
    email : z.email(),
    password : z.string().min(6).max(30),
})

export const resetPassBody = z.object({
    email : z.email(),
})

export const verifyOtpBody = z.object({
    email : z.email(),
    otp : z.string().length(6)
})
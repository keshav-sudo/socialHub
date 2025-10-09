import { z} from "zod"

export const signupBody = z.object({
    name : z.string().max(30),
    email : z.email(),
    password : z.string().min(6).max(30),
    username : z.string().min(4),

})

export const loginBody = z.object({
    password: z.string().min(6).max(30),
    identifier: z.string().refine(
        (val) => z.string().email().safeParse(val).success || z.string().min(4).safeParse(val).success,
        {
            message: "Identifier must be a valid email or a valid username.",
        }
    ),
});
export const resetPassBody = z.object({
    email : z.email(),
})

export const resetPass = z.object({
    email : z.email(),
    newPassword : z.string().min(6).max(30)
})

export const verifyOtpBody = z.object({
    email : z.email(),
    otp : z.string().length(6)
})